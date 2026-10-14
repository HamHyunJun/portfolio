import type { ContactLink } from "~/structure/user"

// 값을 채우면 페이지 하단에 연락 링크로 표시된다. 예: { label: "블로그", href: "https://..." }
export const contacts: ContactLink[] = [
    { label: "GitHub", href: "https://github.com/HamHyunJun" },
    { label: "010-8697-3667", href: "tel:+821086973667" },
    { label: "hhj3667@naver.com", href: "mailto:hhj3667@naver.com" },
]
