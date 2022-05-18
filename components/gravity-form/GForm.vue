<template>
    <div :id="`nuxt_gform_${gformID}`" 
        :class="{'form-submitted' : showConfirmation }"
        class="gravity-form-nuxt">
        <div v-if="useDebug" class="debug-info">
            {{formInputsData}}
            <hr>
            errors: {{errors}}
            <hr>
            success send: {{fromSendedSuccesfully}}
            <div class="actions">
                <button @click="getForm()">GET FORM</button>
                <button @click="showDebug = !showDebug ">Show debug</button>
            </div>

            <Debug @close="showDebug = false" v-if="showDebug" :data="form" />
        </div>

        <div class="gform_loading_form" :id="`gform_loading_${gformID}`" v-if="isLoading">The form is loading, please wait!</div>
        <div class="gform_loading_form loading_form_error" :id="`gform_loading_${gformID}`" v-if="!isLoading && !form">There is an problem with loading form. Sorry for the issues.</div>
        
        <Confirmation v-if="showConfirmation" :message="confirmationMsg" />

        <div v-if="showForm()" 
            :id="'gform_wrapper_' + form.id" 
            class="gform_wrapper"
            :class="theme"
        >
            <div :id="'gf_' + form.id" class="gform_anchor" tabindex="-1"></div>
            <ErrorMessage v-if="formHasErrors()" />

            <div class="gform_heading">
                <h2 class="gform_title" v-html="form.title" />
                <div v-if="form.description" class="gform_description" v-html="form.description" />
            </div>
            
            <form 
                @submit.prevent="onSubmitCallback"
                :enctype="isMultipart ? 'multipart/form-data' : false"
                :id="'gfrom_' + form.id" 
                :key="`gfrom_-${form.id}`" 
                class="g-form" 
                ref="html_form">
                <div class="gform_body gform-body"> 

                    <div class="gform-sending-overlay" v-if="isSending" />

                    <div :id="'gform_fields_' + form.id"
                        :class="formInnerBodyClasses"
                        v-if="gFields && gFields.length"
                    >

                        <template v-for="field in gFields" :class="field.cssClass" >
                            <InputWrapper 
                                v-if="dynamicComponent(field.type)" 
                                :key="field.id"
                                :field="field"
                                :inputName="inputName(field.id)"
                                :formSubLabelPlacement="formSubLabelPlacement"
                                :formDescriptionPlacement="formDescriptionPlacement"
                                :formLabelPlacement="formLabelPlacement"
                                :id="wrapId(field.id)"
                                :hasError="inputWithErrors(inputName(field.id))"
                                :error="inputReadMessage(inputName(field.id))"
                            >
                                <component
                                    :inputId="inputFieldId(field)"
                                    :key="field.id"
                                    :class="inputFieldClass(field)"
                                    v-model="formInputsData['input_'+field.id]"
                                    :inputName="inputName(field.id)"
                                    :field="field" 
                                    :is="dynamicComponent(field.type)"
                                    :hasError="inputWithErrors(inputName(field.id))"
                                    :maxFormFileSize="fieldIsFile(field) && form.max_upload_size ? form.max_upload_size : undefined"
                                />
                                
                            </InputWrapper>
                        </template>

                    </div>
                </div>

                <div class="gform_footer" :class="formLabelPlacement">
                    <slot 
                        name="submitButton"
                        class="gform__button gform_button"
                        :id="'gform_submit_button_'+form.id"
                        type="submit"
                        :disabled="isSending"
                        :formButton="form.button"
                    />
                    <button
                        v-if="!hasSlotSubmit"
                        class="gform__button gform_button"
                        :disabled="isSending"
                        :id="'gform_submit_button_'+form.id"
                        type="submit"
                    >
                        <template v-if="isSending"><span class="gform__button__loading_span">Loading ...</span></template>
                        <template v-else>
                            <span class="gravity_button_label" v-if="form.button.type === 'text'">{{form.button.text}}</span>
                            <span class="gravity_button_image" v-if="form.button.imageUrl"><img :src="form.button.imageUrl" /></span>
                        </template>
                    </button>

                </div>
            </form>
        </div>
    </div>
</template>

<script>

import Name from '@/components/gravity-form/Inputs/Name'

import Input from '@/components/gravity-form/Inputs/Input'
import Textarea from '@/components/gravity-form/Inputs/Textarea'
import SelectorList from '@/components/gravity-form/Inputs/SelectorList'
import Select from '@/components/gravity-form/Inputs/Select'
import Html from '@/components/gravity-form/Inputs/Html'
import Multiselect from '@/components/gravity-form/Inputs/Multiselect'
import Captcha from '@/components/gravity-form/Inputs/Captcha'
import Fileupload from '@/components/gravity-form/Inputs/Fileupload'

import InputWrapper from '@/components/gravity-form/Formparts/InputWrapper'
import ErrorMessage from '@/components/gravity-form/Formparts/ErrorMessage'
import Confirmation from '@/components/gravity-form/Formparts/Confirmation'
import SubmissionError from '@/components/gravity-form/Formparts/SubmissionError'

//TODO: Confirmation msg component!

export default {
    name: 'gravity-form',
    props: {
        gformID : {
            type: Number,
        },
        theme: { // by default we are passing base Gravity form styling
            type: String,
            default: 'gravity-theme'
        },
        useDebug:{
            type: Boolean,
            default: false
        },
        apiUrl: {
            type: String,
            default: ''
        },

        /*
        * If form should be loaded after page loads or server side fetch
        * Can be usefull since GF endpoint is slow standard WP REST.
        * So for performance reason it is good idea to render on client side
        * 
        */
        fetchOnServer:{
            type: Boolean,
            default: true
        }
    },
    components:{
        InputWrapper,
        ErrorMessage,
        Confirmation,
        SubmissionError,
    },
    async fetch(){
        await this.getForm()
    },

    fetchOnServer(){
        return this.fetchOnServer //DOC: https://nuxtjs.org/docs/components-glossary/fetch/
    },
    fetchKey(getCounter) {
      return 'gform_' + this.gformID + '_' + getCounter('gform')
    },
    data(){
        return{
            isDev: process.env.NODE_ENV === 'development',

            fromSendedSuccesfully: false,
            formSubmitted: false,
            confirmationMsg: '',
            isSending: false,
            isLoading: true,

            showDebug: false,
            isMultipart: false, //will be set if form contains file upload fields
            errors: {},
            successSubmit: false,
            form: null,
            formInputsData: {},
        }
    },
    computed:{
        hasSlotSubmit(){
           return !!this.$scopedSlots.submitButton || !!this.$slots.submitButton
        },
        showConfirmation(){
            return this.confirmationMsg && this.formSubmitted && this.fromSendedSuccesfully && !this.formHasErrors()
        },
        /*
         * Default placements settings
         * 
        */
        formLabelPlacement(){
            return this.form && this.form.labelPlacement ? this.form.labelPlacement : "top_label"
        },
        formDescriptionPlacement(){
            return this.form && this.form.descriptionPlacement ? this.form.descriptionPlacement : "above"
        },
        formSubLabelPlacement(){
            return this.form && this.form.subLabelPlacement ? this.form.subLabelPlacement : "below"

        },

        gFields(){
            const fields = this.form && this.form.fields ? this.form.fields : false
            if( fields ){
                let hasMultiFile = false
                let multiKey = false

                const multiFileFixFields = fields.reduce( (acc, f, i) => {
                    if(f.type === 'fileupload' && f.cssClass === 'multifile'){
                        if(hasMultiFile && multiKey !== false){
                            acc[multiKey].maxFiles += 1
                            if(f.isRequired) acc[multiKey].minFiles += 1
                            //list of id => required
                            acc[multiKey].multiselect.push( { field : { 'id' : f.id, reqired : (f.isRequired ? true : false) } })

                        }else{
                            multiKey = i
                            hasMultiFile = true
                            f.maxFiles = 1
                            //list of id => required
                            f.multiselect = []

                            f.multiselect.push( { field : { 'id' : f.id, reqired : (f.isRequired ? true : false) } })

                            f.minFiles = f.isRequired ? 1 : 0
                            acc.push(f)
                        }

                    }else{
                        acc.push(f)
                    }

                    return acc
                }, [])
                return multiFileFixFields
            }
            return fields
        },
        //classes for inner body form
        formInnerBodyClasses(){
            let classes = ['gform_fields']
            if(this.formLabelPlacement) classes.push(this.formLabelPlacement)
            if(this.formDescriptionPlacement) classes.push(`description_${this.formDescriptionPlacement}`)
            if(this.formSubLabelPlacement) classes.push(`form_sublabel_${this.formSubLabelPlacement}`)

            classes.push(`form_sublabel_below`) // I don't know what controlls it :)

            return classes
        },
        
        /**
         * Old auth if some one need that for some reason it is keept for that purpose
         */
        gfAuth(){
            
            //https://www.w3schools.com/nodejs/met_buffer_from.asp
            // if not node use https://developer.mozilla.org/en-US/docs/Web/API/btoa or https://developer.mozilla.org/en-US/docs/Web/API/atob
            const customer_key = '' //Use user name not ck_... since this does not work for some reason
            const customer_secret = '' //Use user password not cs_... since this does not work for some reason
            const buff = new Buffer.from( customer_key + ":" + customer_secret );
            return  "Basic " + buff.toString("base64");
        
        },
        
        
        
    },

    mounted(){
    },

    methods: {
        showForm(){
            if(this.useDebug) return this.form && this.form.id //in that case we just want to keep form just easy debug
            return (this.form && this.form.id && !this.formSubmitted) || (this.form && this.form.id && this.formHasErrors())
        },
        formHasErrors(){
            return (Object.keys(this.errors).length !== 0)
        },

        scrollToFromTop(){
            if(!this.form) return;
            if(process.server) return

            try {
                const form = document.getElementById('gform_wrapper_'+this.form.id),
                formRect = form.getBoundingClientRect(),
                bodyRect = document.body.getBoundingClientRect(),
                offset = formRect.top - bodyRect.top;

                window.scrollTo({ top: offset, behavior: "smooth" })
            } catch (error) {
                console.log('Sorry can\'t scroll ')
            }

        },
        /*
        * Simlple validation just for now
        */
        inputWithErrors(inputName){
            if(this.errors && this.formHasErrors() && this.errors[inputName] ){
                return true
            }else{
                return false
            }
        },

        inputReadMessage(inputName){
            if( this.inputWithErrors(inputName) ){
                if(typeof this.errors[inputName] === 'string'){
                    return this.errors[inputName]
                }
            }
            return ''
        },
        
        /**
         * Form Submit action
         * This is handles the data of the form and send it to the api
         * https://docs.gravityforms.com/rest-api-v2/#post-forms-form-id-submissions
         * 
         */
        async onSubmitCallback(ev){
            const VM = this
            
            /*
            * We can't use just form data since it has issue with files in current setup. If there is anytone with better idea to handle it. 
            * You're welcome to change it :)
            * const formData = new FormData(ev.target);
            * That's why I creted new form data and generate whole info based on this.
            * https://developer.mozilla.org/en-US/docs/Web/API/FormData
            * 
            * There is a way to send BOLB files, but I'm not using it
            * https://community.gravityforms.com/t/upload-a-file-to-gravity-forms-via-rest-api/2962/2
            * https://gist.github.com/richardW8k/17d8ee4285d1c0c82125262b9b4348ec
            */


            /**
             * Add validate handler here too.
            */
            let hasErrors = false
            this.errors = {} // null errors
           //Maybe validate all fields before send

            /**
             * Build form data
             * GF naming convention is: input_{field_id}
             */
            const formData = new FormData()

            if(this.gFields && this.gFields.length) this.gFields.forEach( field  => {
                const inputName  = this.inputName(field.id)
                const isFileType = this.fieldIsFile(field)
                const isRequired = field.isRequired
                const fieldData = this.formInputsData[inputName];
                
                //Simple validation for now it does the job
                if(!fieldData && isRequired) {
                    console.warn('REQUIRED FIELD MISSING', inputName)
                    //Input name : message
                    // basically message is for the api validation if so happen
                    this.errors[inputName] = true
                    hasErrors = true
                    return
                }

                if(!fieldData && !isRequired) return;
                
                /*
                 * TODO: Rewrite to switch!
                 */
                if(field.type === 'checkbox' && fieldData.length){
                    //handle checkbox
                    //checkbox are send lik:
                    /*
                     * input_3.1 : “First Option”
                     * input_3.2 : “Second Option”
                     * input_{input_id}.{checkbox_key + 1} : {value}
                     * https://community.gravityforms.com/t/upload-a-file-to-gravity-forms-via-rest-api/2962/8
                    */

                    const choicesKeys = fieldData.map( v => field.choices.findIndex( c => c.value === v ))
                    
                    if(choicesKeys && choicesKeys.length){
                        choicesKeys.forEach( k => {
                            if(field.inputs[k] && field.choices[k]){
                                //console.log('set', 'input_' + field.inputs[k].id, field.choices[k].value)
                                formData.append( 'input_' + field.inputs[k].id, field.choices[k].value )
                            }
                        })
                    }

                }else if(isFileType){
                //Handle files
                    if(field.multipleFiles){
                        fieldData.forEach( ({file, name}) => {
                            if(file && name) formData.append(inputName, file, name )
                        });
                    }else{
                        //Work around for the multiple files for now
                        if(field.cssClass === 'multifile'){
                            const minItems =  field.minFiles
                            const maxItems =  field.maxFiles
                            const items = fieldData.length
                            if(items < minItems){
                                this.errors[inputName] = 'More files are required'
                                hasErrors = true
                            }else if(items > maxItems){
                                this.errors[inputName] = 'There are too many files selected'
                                hasErrors = true
                            }else{
                                //First we want to populare required fields to avoid missing field errors
                                //maybe order by id too ?
                                const reqItemsFirst = field.multiselect
                                    //.sort((a,b) => Number(a.field.reqired < b.field.reqired) * 2 - 1);
                                    .sort((a,b) => Number(a.field.reqired < b.field.reqired) * 2 - 1);

                                fieldData.forEach( ({file, name}, i) => {
                                    const fileFieldID = reqItemsFirst[i].field.id
                                    if(fileFieldID){
                                        const fileFieldName =this.inputName(fileFieldID);
                                        if(file && name) {
                                            formData.append(fileFieldName, file, name )
                                        }
                                    }
                                });
                            }
                            //this.errors[inputName] = true
                        }else fieldData.forEach( ({file, name}) => {
                            if(file && name) formData.append(inputName, file, name )
                        });
                    }
 
                }else{
                    //console.log('data', fieldData)
                    formData.append( inputName, fieldData )
                }
            });
            
            if(hasErrors) {
                this.scrollToFromTop()
                return false;
            }

            this.isSending = true

            //console.log('fo', formData, ev.target[2].files[0])

            /*
            * Old 
            if(this.isMultipart){
                console.log('is multipart')
                //this.$axios.setHeader('Content-type', 'application/x-www-form-urlencoded')
                //this.$axios.setHeader('Content-type', 'multipart/form-data') 
                //this.$axios.setHeader('Content-type', "multipart/form-data; charset=utf-8; boundary=" + Math.random().toString().substr(2) )
            }else{
                //this.$axios.setHeader('Content-type', 'application/json')
            }
            */

            const baseUrl = this.apiUrl + '/wp-json/gf/v2/forms/' + this.gformID + '/submissions'

            try {

                await this.$axios.$post(baseUrl, 
                    formData //this.formInputsData // That would work only if non files provided etc, but now we are using just formData
                ).then( r => {
                    if(r && r.is_valid){
                        this.fromSendedSuccesfully = true
                        this.confirmationMsg = r.confirmation_message
                    }
                    this.$emit('onFormSubmit', r)
                }).catch(e => {
                    console.log('submission error', e.message)
                    this.$emit('onFormSubmit', false)

                    const response = e.response
                    //process response
                    if(response && response.data && response.status === 400){
                        const data = response.data
                        if(data.validation_messages && (Object.keys(data.validation_messages).length !== 0) ){
                            for (const [key, value] of Object.entries(data.validation_messages)) {
                                const inpName = this.inputName(key)
                                this.errors[inpName] = value
                            }
                            this.scrollToFromTop()
                            hasErrors = true
                        }
                    }

                }) .then( () =>  {
                    this.isSending = false
                    this.formSubmitted = true
                });

            } catch (error) {
                this.formSubmitted = true
                this.isSending = false
            }



        },

        /**
         * Get for actually does not use standard GF api since this is painfull some time and we need only get form nothing more.
         * We are using custom endpoint based on
         * https://bitbucket.org/gohike/gravity-forms/src/devweek/gravityforms.php
         *
         */

        async getForm(){

            if(!this.gformID) return false

            const baseUrl = this.apiUrl + '/wp-json/glamrock/v1/gf/forms/' + this.gformID

            /**
             * Old auth if some one need that for some reason it is keept for that purpose
             */
            //this.$axios.setHeader('Authorization', this.gfAuth)
            //this.$axios.setHeader('Content-type', 'application/json')

            
            await this.$axios.$get(baseUrl).then( e => {
                if(e && e.id && e.is_active === '1' && e.is_trash === '0') {
                    if(e.fields && e.fields.length){
                        e.fields.forEach( f => {
                            //set multipart
                            if( this.fieldIsFile(f) ) this.isMultipart = true

                            //set dynamic binding for object
                            const val = f.defaultValue || ''
                            const inputKey = this.inputName(f.id)
                            this.$set(this.formInputsData, inputKey, val);
                            //this.formInputsData['input_'+f.id] = f.defaultValue || ''
                        });
                    }
                    
                    this.form = e
                    this.$emit('onFormLoad', this.form)

                }
            }).catch(e => {
                console.log('error', e)
                this.$emit('onFormLoad', false)
            }).then(() => {
                this.isLoading = false
            })

        },

        inputFieldId(field){
            return `gf_field_${field.formId}_${field.id}`
        },

        inputFieldClass(field){
            let list = [ 'gfield_input' ]
            const size = field.size || 'large'

            list.push( `gfield_size_${size}` ) // just old fallback
            list.push( `${size}` )

            return list
        },

        fieldIsFile(field){
            if(!field) return false
            return field.type === 'fileupload'
        },
        /**
         * Just to not repeat, we set this in the paretn
         */
        wrapId(inputId){
            return `gfield_${this.form.id}_${inputId}`;
        },

        /**
         * Helper function that return inptut name for the GF convention
         */
        inputName(inputId){
            let id = inputId
            if(inputId.id) id = inputId.id //just in case if some one provide full input field instead of the id
            return `input_${id}`;
        },

        dynamicComponent(type) {
            if(!type) return false
            switch (type) {
            // Add note for unsupported captcha field
            
                case "captcha":
                    return Captcha;
                case "text":
                case "number":
                case "email":
                case "hidden":
                case "date":
                case "phone":
                    return Input;
                case "textarea":
                    return Textarea;
                case "select":
                    return Select
                case "multiselect":
                    return Multiselect;
                case "radio":
                case "checkbox":
                    return SelectorList;
                case "html":
                    return Html;
                case "fileupload":
                    return Fileupload;
                case "name":
                    return Name;

                default:
                    return null;
            }
        }
    },
}
</script>

<style lang="scss" scope>
    .gform_wrapper.gravity-theme{

        .hidden_label .gfield_label,
        .hidden_sub_label,
        .screen-reader-text{
            border: 0;
            clip: rect(1px,1px,1px,1px);
            -webkit-clip-path: inset(50%);
            clip-path: inset(50%);
            height: 1px;
            width: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            word-wrap: normal!important;
        }

        .gfield_label{
            font-weight: bold;
        }


        .gform_fields{
            width: 100%;
            display: -ms-grid;
            display: grid;
            grid-template-columns: repeat(12,1fr);
            grid-template-rows: repeat(auto-fill,auto);
            grid-column-gap: 2%;
            grid-row-gap: 16px;
        }
        .gfield {

            grid-column: 1/-1;

            &.gfield--width-full {
                grid-column: span 12
            }
            &.gfield--width-eleven-twelfths {
                grid-column: span 11
            }
            &.gfield--width-five-sixths {
                grid-column: span 10
            }
            &.gfield--width-three-quarter {
                grid-column: span 9
            }
            &.gfield--width-two-thirds {
                grid-column: span 8
            }
            &.gfield--width-seven-twelfths {
                grid-column: span 7
            }

            &.gfield--width-half {
                grid-column: span 6
            }

            &.gfield--width-five-twelfths {
                grid-column: span 5
            }

            &.gfield--width-third {
                grid-column: span 4
            }

            &.gfield--width-quarter {
                grid-column: span 3
            }
            
            textarea{
                width: 100%;
                &.small{
                   height: 96px; 
                }
                &.medium{
                    height: 192px;
                }
                &.large{
                    height: 288px;
                }
            }

            input, select{
                &.large{
                    width: max-content;
                    width: -webkit-fill-available;
                }
            }

            input[type=color], 
            input[type=date], 
            input[type=datetime-local], 
            input[type=datetime], 
            input[type=email], 
            input[type=month], 
            input[type=number], 
            input[type=password], 
            input[type=search], 
            input[type=tel], 
            input[type=text], 
            input[type=time], 
            input[type=url], 
            input[type=week], 
            select, 
            textarea{
                font-size: 15px;
                padding: 8px;
                margin-bottom: 0;
                margin-top: 0;
            }
        }

        /**
         * Transitions
         */

        .gform_fade-enter-active, .gform_fade-leave-active {
            transition: opacity .2s;
        }
        .gform_fade-enter, .gform_fade-leave-to /* .gform_fade-leave-active below version 2.1.8 */ {
            opacity: 0;
        }


       
    }

</style>


