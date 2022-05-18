<template>
    <div class="gform_confirmation" v-html="message">
    </div>
</template>


<script>
export default {
    name: 'gf-confirmation',
    props:{
        message: {
            type: String,
            default: 'Form submitted succesfully'
        }
    }
}
</script>