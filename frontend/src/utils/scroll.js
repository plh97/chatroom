export function scrollToBottom(scrollEl) {
    // scroll container is default as App-Message
    const el = scrollEl || document.querySelector('.App-Message')
    if (!el) return;
    el.scrollTop = el.scrollHeight - el.clientHeight;
}