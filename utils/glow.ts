// 카드 안의 커서 위치를 CSS 변수(--mx, --my)로 넘겨 hover 글로우가 커서를 따라오게 한다
export default {
    trackGlow(e: PointerEvent, selector: string): void {
        const card = (e.target as HTMLElement).closest<HTMLElement>(selector)
        if (!card) return
        const rect = card.getBoundingClientRect()
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`)
        card.style.setProperty("--my", `${e.clientY - rect.top}px`)
    },
}
