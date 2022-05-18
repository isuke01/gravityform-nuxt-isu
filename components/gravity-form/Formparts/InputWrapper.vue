<template>
    <component
        v-if="field"
        :is="wrapperType"
        :class="inputWrapperCalss"
        id={wrapId}
    >   
        <component
            :is="labelType"
            :label-for="inputName"
            v-if="labelText && labelPlacement !== 'below'"
            class="gfield_label"
            v-html="labelText"
        />

        <InputDescription v-if="fieldDesc && descriptionPlacement !== 'below'" :placement="descriptionPlacement">{{fieldDesc}}</InputDescription>

        <div :class="`ginput_container ginput_container_${field.type}`">
            <slot />
            <div v-if="field.maxLength && field.maxLength > 0" class="instruction  ginput_counter warningTextareaInfo">
                {{maxLengthSentence}}
            </div>
            <div class="instruction" v-if="field.rangeMax && field.rangeMin">Enter number between {{field.rangeMin}} and {{field.rangeMax}}</div>
        </div>

        <component
            :is="labelType"
            :label-for="fieldID(field)"
            v-if="labelText && labelPlacement === 'below'"
            class="gform__label gfield_label"
            v-html="labelText"
        />
        <InputDescription v-if="fieldDesc && descriptionPlacement === 'below'" :placement="descriptionPlacement">{{fieldDesc}}</InputDescription>

        <div
            v-if="hasError"
            :id="`validation_message_${field.formId}_${field.id}`"
            aria-live="polite"
            class="gfield_description validation_message gfield_validation_message"
            v-html="errorMessage"
        />
    </component>
</template>


<script>
import InputDescription from '@/components/gravity-form/utils/InputDescription'

export default {
    name: "gform-input-wrapp",
    props: {
        field:{ 
            type: Object
        },
        hasError:{
            type: Boolean,
            default: false
        },
        inputName:{
            type: String,
            default: ''
        },
        error:{
            type: String,
            default: ''
        },
        formSubLabelPlacement:{
            type: String,
            default: 'below'
        },
        formDescriptionPlacement:{
            type: String,
            default: 'above'
        },
        formLabelPlacement:{
            type: String,
            default: 'top_label'
        }
        //error TO DO
    },
    components:{
        InputDescription
    },
    methods:{
        fieldID(field){
            return `gf_field_${field.formId}_${field.id}`
        }
    },
    computed:{
        errorMessage(){
            const msg = this.error || this.field.errorMessage // error message passed has prio, maybe from api error message
            return msg || 'Feltet må fylles ut' //This field is required
        },
        wrapperType(){
            let type = 'div'
            if(this.field.type === 'radio' || this.field.type === 'checkbox') type = 'fieldset'

            return type
        },
        labelType(){
            let type = 'label'
            if(this.field.type === 'radio' || this.field.type === 'checkbox') type = 'legend'

            return type
        },


        inputWrapperCalss(){
            let classes = ['gfield']

            if(this.field.cssClass) classes.push(this.field.cssClass)
            if(this.labelPlacement) classes.push(this.labelPlacement)
            if(this.hasError) classes.push('gfield_error ')

            classes.push(`gfield_visibility_${this.field.visibility}`)
            classes.push(`field_description_${this.descriptionPlacement}`)
            classes.push(`field_sublabel_${this.subLabelPlacement}`)

            //sizing class
            const fieldSize = Number(this.field.layoutGridColumnSpan) || 12
            let sizeClass = 'gfield--width-'

            switch (fieldSize) {
                case 6:
                    sizeClass += 'half'
                    break;
                case 3:
                    sizeClass += 'quarter'
                    break;
                case 4:
                    sizeClass += 'third'
                    break;           
                default: //12
                    sizeClass += 'full'
                    break;
            }

            classes.push(sizeClass)


            return classes
        },
        
        maxLengthSentence(){
            let word = this.field.type === "number" ? "numbers" : "characters";
            return this.field.maxLength && `(maxiumum ${this.field.maxLength} ${word})`;
        },
        labelText(){
            const isRequired = this.field.isRequired
            const  inputLabel = this.field.label + ( isRequired ? '<span class="gfield_required">*</span>' : '' )
            
            return inputLabel || false
        },
        fieldDesc(){
            return this.field && this.field.description ? this.field.description : ''
        },
        labelPlacement(){
            return this.field && this.field.labelPlacement ? this.field.labelPlacement : this.formLabelPlacement
        },
        descriptionPlacement(){
            return this.field && this.field.descriptionPlacement ? this.field.descriptionPlacement : this.formDescriptionPlacement
        },
        subLabelPlacement(){
            return this.field && this.field.descriptionPlacement ? this.field.descriptionPlacement : this.formSubLabelPlacement
        },

        labelClass(){
            let list = [ 'gform__field__wrapper' ]

            list.push( 'gform__wrapp__input__'+this.field.type.toLowerCase() )
            list.push( 'gfield_visibility_'+this.field.visibility.toLowerCase() )

            if(this.field.cssClass) list.push( this.field.cssClass )
            if(this.field.size) list.push( 'gfield_wrap_size_'+this.field.size )
            

            return list
        }
    }
}
</script>