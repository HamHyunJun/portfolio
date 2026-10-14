<template>
    <nav v-if="contacts.length" class="contact" aria-label="연락처">
        <MainSectionTitle title="CONTACT" />
        <p class="contact-lead">
            함께 만들어 갈 기회를<br />
            기다리고 있어요.
        </p>
        <ul class="contact-list">
            <li v-for="contact in contacts" :key="contact.href">
                <a
                    class="contact-link"
                    :href="contact.href"
                    :target="isExternal(contact.href) ? '_blank' : undefined"
                    :rel="isExternal(contact.href) ? 'noopener noreferrer' : undefined"
                >
                    <span class="contact-kind">{{ kindOf(contact.href) }}</span>
                    <span class="contact-value">{{ valueOf(contact) }}</span>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
    import { contacts } from "~/data/contacts"
    import type { ContactLink } from "~/structure/user"

    const isExternal = (href: string): boolean => /^https?:\/\//.test(href)

    const kindOf = (href: string): string => {
        if (href.startsWith("tel:")) return "Phone"
        if (href.startsWith("mailto:")) return "Email"
        if (/^https?:\/\/(www\.)?github\.com/.test(href)) return "GitHub"
        return "Link"
    }

    // 라벨이 종류 이름과 같으면(예: GitHub) 주소를 대신 보여 준다
    const valueOf = ({ label, href }: ContactLink): string =>
        label.toLowerCase() === kindOf(href).toLowerCase()
            ? href.replace(/^https?:\/\/(www\.)?/, "")
            : label
</script>

<style lang="scss" scoped>
    .contact {
        display: flex;
        flex-direction: column;
        gap: 40px;

        .contact-lead {
            font-size: clamp(28px, 5vw, 48px);
            font-weight: 700;
            line-height: 130%;
            letter-spacing: -0.02em;
            color: var(--white);
            word-break: keep-all;
        }

        .contact-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 16px;
            list-style: none;
            padding: 0;
            margin: 0;

            .contact-link {
                position: relative;
                display: flex;
                flex-direction: column;
                gap: 12px;
                height: 100%;
                padding: 24px 48px 24px 24px;
                border: 1px solid rgb(255 255 255 / 8%);
                border-radius: var(--rounded-lg);
                background: var(--gray);
                color: var(--white);
                text-decoration: none;
                transition:
                    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
                    background-color 0.3s ease,
                    border-color 0.3s ease;

                &::after {
                    content: "↗" / "";
                    position: absolute;
                    top: 24px;
                    right: 24px;
                    font-size: 20px;
                    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
                }

                &:hover {
                    transform: translateY(-4px);
                    background: #484848;
                    border-color: rgb(255 255 255 / 25%);

                    &::after {
                        transform: translate(3px, -3px);
                    }
                }

                &:active {
                    transform: scale(0.97);
                }

                &:focus-visible {
                    outline: 2px solid var(--white);
                    outline-offset: 3px;
                }

                .contact-kind {
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--primary);
                }

                .contact-value {
                    font-size: 18px;
                    font-weight: 600;
                    overflow-wrap: anywhere;
                }
            }
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .contact .contact-list .contact-link {
            transition-duration: 0.01ms;

            &:hover {
                transform: none;
            }
        }
    }
</style>
