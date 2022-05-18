<template>
    <textarea 
        :id="inputId"
        :value="value" 
        @input="$emit('input', $event.target.value)"
        :name="inputName"
        :max-length="field.maxLength || false"
        :placeholder="field.placeholder || false"
        :aria-required="field.isRequired"
        :aria-invalid="hasError"
        :pattern="regex"
        :autocomplete="autoCompletable"
        rows="10"
        cols="50"
    />
</template>

<script>
export default {
    name: 'gf-input-textarea',
    props: {
        value: '',
        field:{ 
            type: Object
        },
        hasError: {
            type: Boolean,
            default: false,
        },
        inputName:{
            type: String,
            default: ''
        },
        inputId:{
            type: String,
            default: ''
        }
    },
    computed: {
        autoCompletable(){
            //https://www.w3.org/TR/WCAG21/#input-purposes
            let autocomplete = this.field.enableAutocomplete ? true : false
            if(this.field.enableAutocomplete && this.field.autocompleteAttribute){
                autocomplete = this.field.autocompleteAttribute
            }
            
            return autocomplete
        },
        regex(){
            return this.field.inputMask && this.field.inputMaskValue ? new RegExp(this.field.inputMaskValue) : false;
        }
    }
}
</script>