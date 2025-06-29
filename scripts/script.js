const fetchAll = () => {
  const handle = document.getElementById('handleInput').value.trim();
  const resultDiv = document.getElementById('result');
  let html = '';

  if (!handle) {
    resultDiv.innerHTML = 'Please enter a handle.';
    return;
  }

  resultDiv.innerHTML = 'Loading...';

  Promise.all([
    fetch(`https://codeforces.com/api/user.info?handles=${handle}`).then(res => res.json()),
    fetch(`https://codeforces.com/api/user.rating?handle=${handle}`).then(res => res.json()),
    fetch(`https://codeforces.com/api/user.status?handle=${handle}&count=1000`).then(res => res.json())
  ])
    .then(data => {
      const info = data[0];
      const rating = data[1];
      const status = data[2];

      if (info.status !== 'OK') {
        resultDiv.innerHTML = 'User not found.';
        return;
      }

      const user = info.result[0];
      const ratings = rating.result;
      const subs = status.result;

      const acceptedSubs = subs.filter(s => s.verdict === 'OK' && s.problem);
      const lastSubs = acceptedSubs.slice(0, 5).map(s => {
        let r = s.problem.rating;
        if (r === undefined) r = 'Unrated';
        return `<li>${s.problem.name} [${r}]</li>`;
      }).join('');

      const tagCount = {};
      subs.forEach(s => {
        if (s.verdict === 'OK' && s.problem && s.problem.tags) {
          s.problem.tags.forEach(tag => {
            if (!tagCount[tag]) tagCount[tag] = 0;
            tagCount[tag]++;
          });
        }
      });

      const problemSubs = {};
      subs.forEach(s => {
        const key = `${s.problem.contestId}-${s.problem.index}`;
        if (!problemSubs[key]) problemSubs[key] = [];
        problemSubs[key].push(s);
      });

      const oneShot = {};
      Object.entries(problemSubs).forEach(([k, arr]) => {
        if (arr.length === 1 && arr[0].verdict === 'OK') {
          oneShot[k] = arr[0];
        }
      });

      const oneShotCount = Object.keys(oneShot).length;

      const tagStats = {};
      subs.forEach(s => {
        if (s.problem && s.problem.tags && s.verdict) {
          s.problem.tags.forEach(tag => {
            if (!tagStats[tag]) tagStats[tag] = { total: 0, ok: 0 };
            tagStats[tag].total++;
            if (s.verdict === 'OK') tagStats[tag].ok++;
          });
        }
      });

      let consistent = [];
      Object.entries(tagStats).forEach(([tag, stat]) => {
        if (stat.total >= 5) {
          let ratio = stat.ok / stat.total;
          if (ratio >= 0.8) {
            let percent = (ratio * 100).toFixed(1);
            consistent.push(`${tag} (${percent}%)`);
          }
        }
      });

      if (consistent.length === 0) consistent = ['None'];

      let hours = new Array(24).fill(0);
      subs.forEach(s => {
        if (s.creationTimeSeconds) {
          let h = new Date(s.creationTimeSeconds * 1000).getHours();
          hours[h]++;
        }
      });

      let maxHour = 0;
      let maxCount = 0;
      for (let i = 0; i < 24; i++) {
        if (hours[i] > maxCount) {
          maxCount = hours[i];
          maxHour = i;
        }
      }

      let activeHour = maxCount > 0 ? `${maxHour}:00 - ${maxHour}:59` : 'No submissions found';

      const days = {};
      subs.forEach(s => {
        if (s.creationTimeSeconds) {
          let d = new Date(s.creationTimeSeconds * 1000).toISOString().slice(0, 10);
          if (!days[d]) days[d] = 0;
          days[d]++;
        }
      });

      let peakDay = null;
      let peakCount = 0;
      for (const d in days) {
        if (days[d] > peakCount) {
          peakCount = days[d];
          peakDay = d;
        }
      }

      let dates = Object.keys(days).sort();
      let longest = 0;
      let current = 0;
      let lastDate = null;

      dates.forEach(d => {
        let dateObj = new Date(d);
        if (lastDate) {
          let diff = (dateObj - lastDate) / (1000 * 3600 * 24);
          if (diff === 1) current++;
          else {
            if (current > longest) longest = current;
            current = 1;
          }
        } 
        else current = 1;
        lastDate = dateObj;
      });
      if (current > longest) longest = current;

      let per = 'N/A';
      if (user.rating) {
        let p = ((user.rating - 800) / (3500 - 800)) * 100;
        if (p < 1) per = 1;
        else if (p > 99) per = 99;
        else per = p.toFixed(1);
      }

      html += `
        <img src="${user.titlePhoto}" width="120" height="120" style="border-radius:50%; margin-bottom:15px; object-fit:cover; box-shadow:0 4px 12px rgba(0,0,0,0.15); border:2px solid #1f8ac0;" />
        <h2><a href="https://codeforces.com/profile/${user.handle}" target="_blank" style="text-decoration:none; color:inherit;">${user.handle}</a> (${user.rank ? user.rank : 'Unrated'})</h2>
        <p><b>Rating:</b> ${user.rating ? user.rating : 'N/A'}</p>
        <p><b>Max Rating:</b> ${user.maxRating ? user.maxRating : 'N/A'} (${user.maxRank ? user.maxRank : '-'})</p>
        <p><b>Contribution:</b> ${user.contribution}</p>
        <p><b>Last Online:</b> ${new Date(user.lastOnlineTimeSeconds * 1000).toLocaleString()}</p>
        <p><b>Recent Solved:</b><ul>${lastSubs}</ul></p>
        <p><b>One Shot:</b> ${oneShotCount}</p>
        <p><b>Consistent Tags:</b> ${consistent.join(', ')}</p>
        <p><b>Most Active Hour:</b> ${activeHour}</p>
        <p><b>Peak Submission Day:</b> ${peakDay ? `${peakDay} (${peakCount} submissions)` : 'No submissions found'}</p>
        <p><b>Longest Submission Streak:</b> ${longest} days</p>
        <p><b>Global Percentile:</b> top ${per}%</p>
      `;

      const total = subs.length;
      const accepted = subs.filter(s => s.verdict === 'OK').length;
      let acc = '0.00';
      if (total > 0) acc = ((accepted / total) * 100).toFixed(2);

      html += `
        <p><b>Total Submissions:</b> ${total}</p>
        <p><b>Accepted:</b> ${accepted}</p>
        <p><b>Accuracy:</b> ${acc}%</p>
      `;

      resultDiv.innerHTML = html;

      const ratingCanvas = document.getElementById('ratingChart');
      if (ratings.length > 0) {
        ratingCanvas.style.display = 'block';
        let labels = ratings.map(r => r.contestName);
        let data = ratings.map(r => r.newRating);
        renderChart('ratingChart', 'Rating Over Contests', labels, data, '#1f8ac0');
      } else {
        ratingCanvas.style.display = 'none';
      }

      const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 10);
      let tagLabels = topTags.map(t => t[0]);
      let tagData = topTags.map(t => t[1]);
      const tagCanvas = document.getElementById('tagChart');
      if (tagLabels.length > 0) {
        tagCanvas.style.display = 'block';
        renderChart('tagChart', 'Top tags', tagLabels, tagData, '#6a1b9a', true);
      } else {
        tagCanvas.style.display = 'none';
      }

      document.getElementById('downloadBtn').style.display = 'inline-block';

    })
    .catch(err => {
      resultDiv.innerHTML = 'Error fetching data.';
      console.log(err);
    });
};
