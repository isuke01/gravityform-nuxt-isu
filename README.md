# NUXT/Vue2 Gravity Form component
#### Tested with Gravity form 2.6.3 and WP 5.9.3

This is just example of usage the component.

This is simple implementation for base elements for the Gravity form and Nuxt2, but it should work also with VUE2.


### IMPORTANT
Inspired by: https://bitbucket.org/gohike/gravity-forms/src/master/
To make this work we have to add extra endpoint to get GF.
And enable Rest API for GF in Gravity form settings

```php
class Headless_GravityForms
{
  public $rest_base = 'gf/forms';

  public function __construct($namespace)
  {
    /**
     * @api {get} /glamrock/v1/gf/forms/1
     * @apiName GetForm
     * @apiGroup GravityForms
     * @apiDescription Retreive a single form
     * @apiParam {Number} form_id ID of the form
     *
     * @apiSuccess {Object[]} GF_Form Object (excluding notifications)
     */
    register_rest_route($namespace, $this->rest_base . '/(?P<form_id>[\d]+)', [
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'get_form'],
        'args' => [
          'context' => [
            'default' => 'view',
          ],
        ],
      ],
    ]);
  }

  /**
   * Retreive a single form and all fields and options (exluding notifications)
   * @param WP_REST_Request $request
   * @return WP_Error|WP_REST_Response
   */
  public function get_form(WP_REST_Request $request)
  {
    $form_id = $request['form_id'];
    $form = GFAPI::get_form($form_id);

    if ($form) {
      // Strip data we do not want to share
      unset($form['notifications']);
      $form['max_upload_size'] = wp_max_upload_size();

      return new WP_REST_Response($form, 200);
    } else {
      return new WP_Error('not_found', 'Form not found', ['status' => 404]);
    }
  }

}

/**
 * Register custom API routes
 */
add_action('rest_api_init', function () {
  $api_namespace = 'glamrock/v1';
  new Headless_GravityForms($api_namespace);
});

```

## TO DO:
    FIX LABEL FOR !!! 

    Nested inputes (?)
    Paginated paged form
    Add support for hidden labels
    Add support for dynamic populated  values
    Add support for datepickers
    Add support to HTML dynamic fields
    Add support for condition logic fields
    Form settings for label placement
    Number fields enable calculation (? whatever it is for GF)
    Require mark based on Form settings
    Numbers: Format number
    Make label as Component
    Checkboxes select all option
    Better validations
    Rewrite to standard vue 2 (?)
    Rewrite to Vue 3 (?)
    Rewrite to NPM package (?)
    Create better logic functions with mixins

    Create i18n support

    

TODO: Implement number min/max, these currently aren't fetch by the source plugin
https://docs.gravityforms.com/field-object/#number
<div class="instruction ">
    Please enter a number from <strong>1</strong> to <strong>15</strong>.
</div>

# USAGE            

Example usage: 

```js
    <GForm 
    :gformID="formId" 
    :apiUrl="WPUrl"
    theme="gravity-theme my-form-class"
    ></GForm>
```

Props: 
    `gformID` ID of the Gravity form
    `apiUrl` Url for our WP e.g https://headless.mypage.com or https://headless.mypage.com/{sitename} in case of multisite usage and pointing one (my case :) ).
    `useDebug` Just for debugging purpose
    `theme` Just calss for the form. Default: `gravity-theme`

Callbacks:
    `onFormSubmit` It triggered after form submission, it returns api response after submission or false in case of failure
    `onFormLoad` It triggers after form loads, it returns response from the api or false in case of failure

Example usage with custom component button: 
```js
    <GForm 
    :gformID="formId" 
    :apiUrl="WPUrl"
    >
      <template v-slot:submitButton="slotProps">
          <Button 
              v-bind="slotProps"
              button 
              type="submit" 
              class="gform__button gform_button" 
              icon="arrow"
          >
            <template v-if="slotProps.isSending"><span class="gform__button__loading_span">Loading ...</span></template>
            <template v-else>
                <span class="gravity_button_label" v-if="slotProps.formButton.type === 'text'">{{slotProps.formButton.text}}</span>
                <span class="gravity_button_image" v-if="slotProps.formButton.imageUrl"><img :src="slotProps.formButton.imageUrl" /></span>
            </template>
          </Button>
        </template>
    </GForm>
```
Tip: 
`slotProps` are props passed by slot to the template, and we bind them into our custom `Button` in the example case. More: https://v2.vuejs.org/v2/guide/components-slots.html#Scoped-Slots
### Custom submit button

Custom submit button can be set using scoped slot named `submitButton`
Example usage with custom component button:
```html
<template v-slot:submitButton="slotProps">
    <VButton v-bind="slotProps" button icon="arrowRight" >Slot button test?</VButton>
</template>
```
The `slotProps` also contain all buttons settngs from the gravity form, accessably by `slotProps.formButton` inside the element.

### Multifile

- Graivty form api v2 does not support multi select file, please go to https://www.gravityforms.com/gravity-forms-roadmap/ and add feature request so i can be implemented.
- The issue: https://community.gravityforms.com/t/rest-api-multi-file-upload/11697
- As for now We are using work around - merge multiple file fields. Add class to the each file field `multifile` to display them as one multi select on the front.
- Max Files count will be dettermined by file fields count with this class, min files count will be dettermined by count of those fields that are set as required.
- Custom vladiation message will be used from first file, also every other settings like extensions and file size. But just in case mirrow those settings for API validation side, which I can't do anything bout tih.
- Field title and description is also taken from the first one



## Road map

## Form sizing and placing 
  - Done. This allow to use ling,short, next to each other etc form build from Gravity form. This will work only with default theme class.

## GForm.vue
 - Re write a bit for smaller components - better logic 

## Honey pot

## Required label  from GF setting

### Base input 
 [🗸] text
 [🗸] number
 [🗸] email
 [🗸] hidden
 [?] phone
 [?] date (?)

### Select input
 [🗸] Done

### Textarea 
 [🗸] base textarea field

### Multi select 
 - multiselect
 Make multiselect nice, not default

### Selectors
 [🗸] Radio
 [🗸] Checkbox

### HTML

### FILE
 - Single file supload -> make it nice drop area
 - Multi select file -> FOR NOW DOES NOT SUPPORTED BY GRAVITY FORM

### Name (special field GF )

### Captcha


### LICENSE
    OpenSource.
    Take it and do whatever with it, Would be nice if you point me out somewhere if I'm inspired/helped you in any means :)
