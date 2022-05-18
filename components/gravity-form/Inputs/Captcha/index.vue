<template>
    <div class="input">
        CAPTCHA IS NOT SUPPORTED YET
    </div>
</template>

<script>
export default {
    name: 'gf-input',
    props: {
        value: '',
        field:{ 
            type: Object
        },
        inputName:{
            type: String,
            default: ''
        }
    },
}
</script>