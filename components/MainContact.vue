<template>
    <nav v-if="contacts.length" class="contact" aria-label="연락처">
        <MainSectionTitle title="CONTACT" />
        <ul class="contact-list">
            <li v-for="contact in contacts" :key="contact.href">
                <a
                    class="contact-link"
                    :href="contact.href"
                    :target="isExternal(contact.href) ? '_blank' : undefined"
                    :rel="isExternal(contact.href) ? 'noopener noreferrer' : undefined"
                >
                    {{ contact.label }}
                </a>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
    import { contacts } from "~/data/contacts"

    const isExternal = (href: string): boolean => /^https?:\/\//.test(href)
</script>

<style lang="scss" scoped>
    .contact {
        display: flex;
        flex-direction: column;
        gap: 30px;

        .contact-list {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            list-style: none;
            padding: 0;
            margin: 0;

            .contact-link {
                display: inline-block;
                padding: 12px 24px;
                border-radius: var(--rounded-full);
                background: var(--gray);
                color: var(--white);
                font-weight: 600;
                text-decoration: none;
                transition:
                    transform 0.2s ease,
                    background-color 0.2s ease;

                &:hover {
                    background: #505050;
                }

                &:active {
                    transform: scale(0.96);
                }

                &:focus-visible {
                    outline: 2px solid var(--white);
                    outline-offset: 3px;
                }
            }
        }
    }
</style>
