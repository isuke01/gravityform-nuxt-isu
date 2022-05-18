<!-- Please remove this file from your project -->
<template>
  <div id="example-main">
    <GForm 
    :gformID="formId" 
    :apiUrl="apiUrl"
    theme="gravity-theme"
    ></GForm>

  </div>
</template>

<script>
import GForm from '@/components/gravity-form/GForm'

export default {
  name: 'ExampleUsage',
  components: {
    GForm
  },
  data(){
    return {
      formId: 1,
      apiUrl: 'http://multidomainuxt.wp/bar'
    }
  }
}
</script>

<style lang="scss">
  html{
    background-color: #f7f7f7;
    font-size: 16px;
  }
  #example-main{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: center;
  }
  .gravity-form-nuxt{
    padding: 20px;
    margin: 20px;
    max-width: 80%;
    width: 100%;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 2px 2px 11px 2px #e8e6e6;
  }


/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
</style>