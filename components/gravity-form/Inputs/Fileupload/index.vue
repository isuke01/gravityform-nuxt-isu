<template>

    <div v-if="field.multipleFiles" class="gfinfo">
        Sorry, multiple Fields upload is not supported by Gravity form api at this point.
        You can ask form provider to add support for multi-file API form support
        <a href="https://www.gravityforms.com/gravity-forms-roadmap/" target="blank" rel="noopener noreferer">Gravity form reoad map</a>
    </div>

    <div v-else class="gform_upload_container">
	    <transition name="gform_fade" >
        <div v-show="$refs.upload && $refs.upload.dropActive" class="gf_drop_active drop-active">
          <h4 class="gf_drop-title">{{dropFilesToUploadString}}</h4>
        </div>
      </transition>
      <div class="gform_upload_error" v-if="errorValidationMsg">
        {{errorValidationMsg}}
      </div>

      <ul class="gform_upload_filelist" v-if="files.length">
        <li class="gform_upload_filelist_item" v-for="file in files" :key="file.id">
          <div class="gform_upload_thumb">
            <img width="75px" height="75px" class="gform_upload_thumb" v-if="file.thumb" :src="file.thumb" />
            <span v-else class="gform_upload_file_icon" >
              <svg height="512" viewBox="0 0 511.983 511.983" width="512" xmlns="http://www.w3.org/2000/svg"><path fill="#0E1824" d="M488.265 264.692c-7.612-28.41-25.798-52.135-51.207-66.805a109.475 109.475 0 0 0-37.146-13.276V73.962c0-2.653-1.055-5.198-2.931-7.073l-64-63.962A10.002 10.002 0 0 0 325.912 0h-296c-5.522 0-10 4.477-10 10v491.962c0 5.523 4.478 10 10 10h310.966c.428.008.855.021 1.283.021 6.091 0 12.227-.802 18.271-2.422 18.078-4.844 33.176-16.417 42.512-32.587l74.377-128.823c14.67-25.409 18.557-55.048 10.944-83.459zM335.912 34.132l29.848 29.83h-29.848zM39.912 20h276v53.962c0 5.523 4.478 10 10 10h54v99.237c-37.222.788-73.181 20.422-93.116 54.951l-4.51 7.812H101.912c-5.522 0-10 4.477-10 10s4.478 10 10 10h168.827l-25.404 44H101.912c-5.522 0-10 4.477-10 10s4.478 10 10 10h131.876l-25.404 44H101.912c-5.522 0-10 4.477-10 10s4.478 10 10 10h94.925l-.072.125c-8.271 14.326-3.344 32.71 10.981 40.98 6.938 4.006 15.021 5.07 22.765 2.997 7.739-2.074 14.209-7.038 18.216-13.978l90.029-155.936c13.784-23.876 44.424-32.087 68.302-18.301 23.876 13.785 32.086 44.425 18.301 68.301l-74.376 128.823a9.924 9.924 0 0 1-6.074 4.65 9.926 9.926 0 0 1-7.586-.99c-2.306-1.332-3.958-3.489-4.65-6.075s-.341-5.28.99-7.586l70.702-122.46c8.271-14.326 3.345-32.709-10.981-40.98-14.325-8.271-32.708-3.345-40.98 10.98l-70.702 122.459c-16.287 28.211-10.642 63.165 11.61 84.988h-253.4zm420.089 318.15-74.377 128.823c-6.665 11.544-17.449 19.808-30.367 23.269-12.921 3.461-26.391 1.697-37.934-4.968-23.876-13.785-32.087-44.425-18.302-68.301l70.702-122.459a10.007 10.007 0 0 1 13.66-3.661c4.775 2.757 6.418 8.885 3.661 13.66l-70.702 122.459c-4.003 6.932-5.064 15.016-2.988 22.763 2.075 7.746 7.036 14.216 13.969 18.219 6.934 4.004 15.019 5.063 22.763 2.988 7.746-2.076 14.216-7.037 18.218-13.969L442.68 328.15c19.299-33.427 7.806-76.323-25.621-95.622-33.428-19.299-76.322-7.805-95.622 25.622l-90.029 155.936a9.94 9.94 0 0 1-6.072 4.66 9.936 9.936 0 0 1-7.588-.999c-4.775-2.757-6.418-8.885-3.661-13.661l90.03-155.936c24.813-42.978 79.967-57.753 122.942-32.942 42.977 24.813 57.755 79.965 32.942 122.942z"/><path fill="#0E1824" d="M146.912 137.962h171c5.522 0 10-4.477 10-10s-4.478-10-10-10h-171c-5.522 0-10 4.477-10 10s4.477 10 10 10zM101.915 137.962c2.63 0 5.2-1.07 7.07-2.93 1.86-1.86 2.93-4.44 2.93-7.07s-1.069-5.21-2.93-7.07a10.076 10.076 0 0 0-7.07-2.93c-2.64 0-5.22 1.07-7.08 2.93-1.859 1.86-2.92 4.44-2.92 7.07s1.061 5.21 2.92 7.07a10.1 10.1 0 0 0 7.08 2.93zM101.912 201.962h183.334c5.522 0 10-4.477 10-10s-4.478-10-10-10H101.912c-5.522 0-10 4.477-10 10s4.477 10 10 10z"/></svg>
            </span>
          </div>
          <span class="gform_upload_filename">{{file.name}}</span>
          <button v-if="!useMultiple" class="gform_file_btn gform_remove_btn" type="button" @click.prevent="clearFiles()">Remove</button>
          <button  v-else class="gform_file_btn gform_remove_btn" type="button" @click.prevent="removeFile(file)">Remove</button>
        </li>
      </ul>

      <div v-if="( !useMultiple && !files.length) || (useMultiple && files.length < maxFilesCount)" class="gf_droparea" :class="{ 'gf_drop_multiple' : useMultiple }">
        <h4 class="gf_drop-title">{{dropFilesToUploadString}} or</h4>
        <label :for="fieldID(field)" class="gform_file_btn gform_drop_btn">Select {{ useMultiple ? 'files' : 'file'}}</label>
      </div>

      <file-upload
          v-show="!files.length"
          class="gf_uploa_area"
          :multiple="useMultiple"
          :aria-required="field.isRequired"
          :aria-invalid="hasError"
          :input-id="fieldID(field)"
          :name="inputName"
          :maximum="maxFilesCount"
          :drop="true"
          @input-filter="inputFilter"
          @input-file="inputFile"
          v-model="files"
          ref="upload">
        </file-upload>
        <div class="gform_upload_info" v-if="maxFileSize || field.allowedExtensions">
          <input v-if="maxFileSize" type="hidden" :value="maxFileSize * bytes" name="MAX_FILE_SIZE">
          <span class="gform_fileupload_rules">
            <template v-if="multiFileCountString"><span class="grorm_rule_0files_count">{{multiFileCountString}}.</span></template>
            <template v-if="field.allowedExtensions">Allowed file types: {{field.allowedExtensions}}</template><!--
            --><template v-if="maxFileSize && field.allowedExtensions" >,</template>
            <template v-if="maxFileSize">Max. file size: {{maxFileSize}} MB.</template>
          </span>
        </div>
    </div>

</template>

<script>
// https://lian-yue.github.io/vue-upload-component/#/documents
// https://lian-yue.github.io/vue-upload-component/#/en/documents#getting-started-ssr-server-isomorphism
//https://github.com/lian-yue/vue-upload-component/blob/master/docs/views/examples/Full.vue
import FileUpload from 'vue-upload-component/dist/vue-upload-component.part.js'

export default {
    name: 'gf-input-files',
    components: {
        FileUpload,
    },
    data() {
        return {
            files: [],
            errorValidationMsg: '',
            bytes: 1048576 //1MB
        }
    },
    mounted() {
        // Everything is mounted and you can access the dropzone instance
    },
    props: {
        value: '',
        field:{ 
            type: Object
        },
        inputName:{
            type: String,
            default: ''
        },
        hasError: {
            type: Boolean,
            default: false,
        },
        maxFormFileSize : {
          type: Number,
          default: 1048576 
        }
    },
    computed:{
        maxFilesCount(){
          return this.useMultiple ? this.field.maxFiles : 1
        },
        minFilesCount(){
          return this.useMultiple && this.field.minFiles ? this.field.minFiles : 0
        },
        multiFileCountString(){
          if(!this.useMultiple) return false
          return 'Max files: ' + this.maxFilesCount + ', min files: ' + this.minFilesCount
        },
        dropFilesToUploadString(){
          return this.useMultiple ? 'Drop files to upload' : 'Drop file to upload'
        },
        useMultiple(){
          //this is for our work around solution
          return !this.field.multipleFiles && this.field.cssClass === 'multifile'
        },
        fileFieldName(){
            return 'gfield_file_' + this.field.id
        },
        maxFileSize(){
          let size = this.field.maxFileSize
          if(!size && this.maxFormFileSize) size = this.maxFileSizeNumber(( this.maxFormFileSize / this.bytes ), 1)

          return size;
        }
    },
    methods:{
        maxFileSizeNumber(number, decimalplaces){
          if(decimalplaces > 0){
              var multiply1 = Math.pow(10,(decimalplaces + 4));
              var divide1 = Math.pow(10, decimalplaces);
              return Math.round(Math.round(number * multiply1)/10000 )/divide1;
          }
          if(decimalplaces < 0){
              var divide2 = Math.pow(10, Math.abs(decimalplaces));
              var multiply2 = Math.pow(10, Math.abs(decimalplaces));
              return Math.round(Math.round(number / divide2) * multiply2);
          }
          return Math.round(number);
        },
        removeFile(item){
          const upl = this.$refs.upload
          const file = upl.get(item)
          if (file) {
            /*
            if (upl.emitFilter(undefined, file)) {
              return false;
            }*/
            const files = upl.files.concat([]);
            const index = files.indexOf(file);
            if (index === -1) {
              console.error('remove', file);
              return false;
            }
            files.splice(index, 1);
            upl.files = files;

            // 定位
            delete upl.maps[file.id];

            // 事件
            upl.emitInput();
            upl.emitFile(undefined, file);
          }

        },
        clearFiles() {
          this.$refs.upload.clear()
        },
        fieldID(field){
            return `gf_field_${field.formId}_${field.id}`
        },

        getFileExtensions(file){
          return file.name.split('.').pop().toLowerCase()
        },

        inputFilter(newFile, oldFile, prevent) {
            this.errorValidationMsg = ''

             if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
                this.errorValidationMsg = 'Unsupported file type'
                return prevent()
            }
                // Filter php html js file
            if (/\.(php5?|html?|jsx?|json)$/i.test(newFile.name)) {
              this.errorValidationMsg = 'Unsupported file type'
                return prevent()
            }

            /*
            * GF setting validation
            */
            const fileExt = this.getFileExtensions(newFile)
            const gformExt = this.field.allowedExtensions;
            const isgfExtSupported = gformExt ? gformExt.indexOf(fileExt) > -1 : true;

            if(!isgfExtSupported){
                this.errorValidationMsg = 'Unsupported file type'
                return prevent()
            }

            const gformFileSize = this.maxFileSize
            if(gformFileSize && Number(gformFileSize) && ( gformFileSize * this.bytes ) < newFile.size ){
                this.errorValidationMsg = 'File is too big, max is: ' + gformFileSize + 'MB'
                return prevent()
            }
            

            if (newFile && newFile.error === "" && newFile.file && (!oldFile || newFile.file !== oldFile.file)) {
                // Create a blob field
                newFile.blob = ''

                let URL = (window.URL || window.webkitURL)
                if (URL) {
                    newFile.blob = URL.createObjectURL(newFile.file)
                }
                    // Thumbnails
                newFile.thumb = ''
                if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
                    newFile.thumb = newFile.blob
                }
            }
        },
        inputFile(newFile, oldFile){
            const files = this.files  && this.files.length ? this.files : false
            this.$emit('input', files)
        }
    }
}
</script>

<style lang="scss">
.gform_body {
  .gform_upload_container{
    border: 2px dashed #BCBCBC;
    border-radius: 5px;
    background-color: #fff;
    padding: 25px;
    text-align: center;
    position: relative;
    .gf_droparea{
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
    }
    .gform_upload_filelist{

    }
    .gform_upload_filelist_item{
      display: flex;
      align-items: center;
      width: 100%;
      .gform_upload_thumb{
        margin-right: 15px;
        .gform_upload_file_icon{
          display: inline-block;
          line-height: 1;
          svg{
            width: 42px;
            height: 46px;
          }
        }
      }
      .gform_upload_filename{
        flex: 1;
        text-align: left;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-right: 15px;
      }
    }
    .gf_drop-title{
      margin: 0
    }
    .gform_upload_error{
      margin-bottom: 15px;
      font-weight: bold;
      color: #f44336;
    }
    .gform_drop_btn{
      margin-left: 15px;
    }
    .gform_remove_btn{

    }
    .gform_file_btn{
      font-size: 16px;
      color: #fff;
      padding: 12px 25px;
      background-color: #2196f3;
      line-height: 1;
      display: inline-block;
      cursor: pointer;
      border-radius: 0;
      font-weight: bold;
      text-transform: uppercase;
      border: 2px solid #2196f3;
      transition: background-color 0.15s ease-in-out;
      &:hover{
        background-color: #1976d2;
      }
    }
    .gf_drop_active{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(#2196f3, 0.95);
      z-index: 5;
      color: #fff;
      display: flex;
      width: 100%;
      border-radius: 5px;
      justify-content: center;
      align-items: center
    }
  }
  .file-uploads {
    overflow: hidden;
    position: relative;
    text-align: center;
    //display: inline-block;
  }
  .file-uploads.file-uploads-html4 input[type="file"] {
    opacity: 0;
    font-size: 20em;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .file-uploads.file-uploads-html5 input[type="file"] {
    overflow: hidden;
    position: fixed;
    width: 1px;
    height: 1px;
    z-index: -1;
    opacity: 0;
  }
}

/*
import '~vue-upload-component/dist/vue-upload-component.part.css'
@import "~vue-upload-component/dist/vue-upload-component.part.css";


or


 */
/*
*/

</style>