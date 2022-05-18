<template>
    <div :class="`gfield_${field.type}`" :id="inputId">
        <template v-if="field && field.choices">
            <div 
                v-for="(choice, k) in field.choices"
                :key="k"
                class="gchoice" 
                :class="`gchoice_${field.formId}_${field.id}_${fixNumber(k)}`"
            >
                <input 
                    :type="field.type"
                    :value="choice.value" 
                    v-model="selectorModel"
                    :name="fixInputName(k)"
                    :id="inputId + '_' + ( k + 1)"
                />
                <label  
                    v-html="choice.text"
                    :for="inputId + '_' + ( k + 1)"
                    :id="`label_${field.formId}_${field.id}_${fixNumber(k)}`"
                />
            
            </div>
        </template>

    </div>
</template>

<script>
export default {
    name: 'gf-input-selectors',
    props: {
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
    watch : {
        selectorModel(nv){
            this.$emit('input', nv)
        }
    },
    created(){
        let selections = false
        if(this.field && this.field.choices){
            selections = this.field.choices.map( c => c.isSelected ? c.value : false ).filter(e => e)
        }

        if(selections){
            if(this.field.type === 'checkbox'){
                this.selectorModel = selections
            }else{
                this.selectorModel = selections && selections[0] ? selections[0] : ''
            }
        }

    },
    data(){
        return{
            selectorModel: []
        }
    },
    methods:{
        //For some reason Gravity form uses 1 as start for checkbox and 0 for radio
        fixNumber(number){
            if(this.field.type === 'checkbox') return ( number + 1)
            else return number;
        },
        //Also naming is differnt in both cases
        fixInputName(number){
            if(this.field.type === 'checkbox') return this.inputName + '.' + this.fixNumber(number)
            else return this.inputName
        }
    }
}
</script>