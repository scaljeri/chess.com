export async function loadScript(url, className: string, remove = true): Promise<void> {
    return new Promise(r => {
        if (remove) {
            const el = document.querySelector('.' + className);
            el && el.remove();
        }

        const script = document.createElement('script');
        script.classList.add(className);
        document.body.appendChild(script);
        script.async = true;
        script.onload = () => r();
        script.src = url;
    })
}