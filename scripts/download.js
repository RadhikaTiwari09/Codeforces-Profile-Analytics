document.getElementById('downloadBtn').addEventListener('click', () => {
    const card = document.getElementById('result');
    if (!card.innerHTML.trim()) {
        alert('No data to download.');
        return;
    }
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.style.display = 'none';
    html2canvas(card).then(canvas => {
        downloadBtn.style.display = 'inline-block';
        const link = document.createElement('a');
        link.download = 'codeforces_user_card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(err => {
        downloadBtn.style.display = 'inline-block';
        console.error('Error capturing the card:', err);
        alert('Failed to download the card.');
    });
});
