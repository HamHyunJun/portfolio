export interface MainAboutData {
    education: AboutData[]
    awards: AboutData[]
    works: AboutData[]
}

export interface AboutData {
    date: string
    detail: string
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
