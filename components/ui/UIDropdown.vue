<template>
    <ElDropdown
        :class="[$style.dropdown, $attrs.class ?? '']"
        trigger="click"
        :disabled="noUseDropdown"
        :popper-class="`ui-dropdown ${$attrs.popperClass ?? ''}`"
        @visible-change="visibleChangeHandler"
    >
        <div @click.stop>
            <slot name="button" :active="isOpened"></slot>
            <template v-if="!noUseDropdown && !hideChevron">
                <i
                    :class="[$style.chevron, { active: isOpened, [$style.white]: chevronWhite }]"
                    class="icon icon-dropdown-chevron"
                ></i>
            </template>
        </div>
        <template #dropdown>
            <div class="ui-dropdown-body">
                <slot name="dropdown"></slot>
            </div>
        </template>
    </ElDropdown>
</template>
<script lang="ts" setup>
    defineProps<{
        noUseDropdown?: boolean
        hideChevron?: boolean
        chevronWhite?: boolean
    }>()

    const emit = defineEmits<{
        (e: "open", isOpened: boolean): void
    }>()

    const isOpened = ref<boolean>(false)
    const visibleChangeHandler = (opened: boolean): void => {
        isOpened.value = opened
        emit("open", opened)
    }
</script>
<style lang="scss" module>
    .dropdown {
        cursor: pointer;
        &:global(.el-dropdown.is-disabled) {
            color: inherit;
            cursor: pointer;
        }
        :global(.el-tooltip__trigger) {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .chevron {
            width: 8px;
            height: 10px;
            transition: transform 200ms ease;
            transform: rotate(-180deg);

            &:global(.active) {
                transform: rotate(0deg);
            }

            &.white {
                color: white;
            }
        }
    }
</style>
<style lang="scss">
    .ui-dropdown {
        --el-border-color-light: var(--zs_dropdown_border);
        --el-popper-border-radius: 10px;
        overflow: hidden;
        background: var(--zs_dropdown_bg) !important;

        .el-scrollbar {
            overflow: auto;
            max-height: 460px;
            background: transparent;

            .ui-dropdown-body {
                background: inherit;
                .el-dropdown-menu {
                    background: transparent;
                    .el-dropdown-menu__item {
                        min-width: 148px;

                        padding-left: 15px;
                        padding-right: 15px;

                        text-align: left;

                        &:focus {
                            background-color: var(--zs_dropdown_bg_hover);
                            color: black !important;
                        }

                        &:not(.is-disabled) {
                            transition-property: background-color, color;
                            transition-timing-function: ease-out;
                            transition-duration: 0.2s;
                        }

                        &:not(.is-disabled):focus {
                            background-color: var(--zs_dropdown_bg_hover);
                            color: var(--zs_primary_text) !important;
                        }
                    }
                }
            }
        }

        .el-popper__arrow {
            display: none;
        }
    }
</style>
