export interface MainAboutData {
    education: AboutData[]
    awards: AboutData[]
    works: AboutData[]
}

export interface AboutData {
    date: string
    detail: string
    points?: string[]
}

export interface MainSkillData {
    category: "Languages" | "Frameworks & Libraries" | "Tools"
    data: MainSkillDataDetail[]
}

export interface MainSkillDataDetail {
    name: string
    desc: string
    logoText: string
    logoColor: string
    logoBackground: string
}

export interface MainWorkData {
    name: string
    period: string
    summary: string
    stack: string[]
    aiTools?: string[]
    webImage?: string
    appImage?: string
    links: ContactLink[]
}

export interface ContactLink {
    label: string
    href: string
}

export type SectionKey = "about" | "skill" | "works" | "contact"

// 탐색기·탭에 파일처럼 표시되는 섹션 항목
export interface NavFile {
    key: SectionKey
    name: string
    glyph: string
    color: string
}
