declare module "aos" {
    interface AosOptions {
        [key: string]: any
    }

    const AOS: {
        init: (options?: AosOptions) => void
        refresh: () => void
        refreshHard: () => void
    }

    export default AOS
}

declare global {
    interface Window {
        Lenis: any
    }
}

export {}
