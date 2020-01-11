declare var document;

export function cleanup(): void {
    // Live
    const ad = document.querySelector('.board-layout-ad')
    if (ad) {
        ad.remove();
    }

    document.body.style.marginRight = 0;

    // Computer
    const welcomeDialogEl = document.querySelector('#newbie-modal');
    if (welcomeDialogEl) {
        welcomeDialogEl.querySelector('.btn').click();
    }
}