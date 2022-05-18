<template>
    <select
        :id="inputId"
        :aria-required="field.isRequired"
        :aria-invalid="hasError"
        @input="$emit('input', $event.target.value)"
    >
    <option v-if="field.placeholder" value="" class="gf_placeholder" v-html="field.placeholder"></option>
    <template v-for="(choice, k) in field.choices">
        <option :key="k" :value="choice.value" v-html="choice.text" :selected="choice.isSelected"></option>
    </template>

    </select>
    
</template>

<script>
// :required="field.isRequired"

export default {
    name: 'gf-select',
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