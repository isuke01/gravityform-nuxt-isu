<template>
    <div :class="`gfield_description--${placement} gfield_description`">
        <slot ></slot>
    </div>
</template>

<script>
export default {
    name: 'gform-input-description',
    props: {
        placement: {
            type: String,
            default: 'top'
        },
    }
}
</script>