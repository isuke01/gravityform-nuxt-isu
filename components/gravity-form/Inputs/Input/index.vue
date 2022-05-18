<template>
    <input 
        :value="value" 
        @input="$emit('input', $event.target.value)"
        :name="inputName"
        :id="inputId"
        :max-length="field.maxLength || false"
        :type="field.type" 
        :placeholder="field.placeholder || false"
        :aria-required="field.isRequired"
        :aria-invalid="hasError"
        :pattern="regex"
        :autocomplete="autoCompletable"
        
        :step="field.type === 'number'? 'any' : false"
        :max="field.rangeMax || false"
        :min="field.rangeMin || false"
    /> 
</template>

<script>
// :required="field.isRequired"

export default {
    name: 'gf-input',
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