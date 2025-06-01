export interface MainHomeData {
    title: string
    desc: string
    tags: string[]
    details: string[]
}

export interface MainAboutData {
    education: AboutData[]
    awards: AboutData[]
    works: AboutData[]
}

export interface AboutData {
    date: string
    detail: string
}
