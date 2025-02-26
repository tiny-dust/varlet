# Form

### Intro

Provides the ability to control all form components.


### Form Example

```html
<script setup>
import { reactive, ref } from 'vue'

const formData = reactive({
  username: '',
  password: '',
  department: '',
  gender: undefined,
  license: false,
  range: 10,
  count: 0,
  group: [],
  score: 0,
  like: [],
  files: []
})
const form = ref(null)
const disabled = ref(false)
const readonly = ref(false)
</script>

<template>
  <var-form
    ref="form"
    :disabled="disabled"
    :readonly="readonly"
    scroll-to-error="start"
  >
    <var-space direction="column" :size="[14, 0]">
      <var-input
        placeholder="Please input username"
        :rules="[v => !!v || 'The username cannot be empty']"
        v-model="formData.username"
      />
      <var-input
        type="password"
        placeholder="Please input password"
        :rules="[v => !!v || 'The password cannot be empty', (v) => v.length >= 8 || 'The password cannot be less than 8 characters']"
        v-model="formData.password"
      />
      <var-select
        placeholder="Please select department"
        :rules="[v => !!v || 'The select cannot be empty']"
        v-model="formData.department"
      >
        <var-option label="Eat department"  />
        <var-option label="Sleep department"  />
        <var-option label="Play game department" />
      </var-select>
      <var-select
        multiple
        placeholder="Please select group"
        :rules="[v => v.length >= 1 || 'The select cannot be empty']"
        v-model="formData.group"
      >
        <var-option label="Eat group"  />
        <var-option label="Sleep group"  />
        <var-option label="Play game group" />
      </var-select>
      <var-radio-group
        :rules="[v => !!v || 'The gender cannot be empty']"
        v-model="formData.gender"
      >
        <var-radio :checked-value="1">Male</var-radio>
        <var-radio :checked-value="2">Female</var-radio>
      </var-radio-group>
      <var-checkbox-group
        :rules="[v => v.length > 0 || 'The select cannot be empty']"
        v-model="formData.like"
      >
        <var-checkbox :checked-value="1">Eat</var-checkbox>
        <var-checkbox :checked-value="2">Sleep</var-checkbox>
        <var-checkbox :checked-value="3">Play game</var-checkbox>
      </var-checkbox-group>
      <var-rate
        :rules="[v => v >= 3 || 'It has to be greater than 2']"
        v-model="formData.score"
      />
      <var-switch
        variant
        :rules="[v => !!v || 'You must turn on']"
        v-model="formData.license"
      />
      <var-counter
        :rules="[v => v > 10 || 'It has to be greater than 10']"
        v-model="formData.count"
      />
      <var-slider
        :rules="[v => v > 10 || 'It has to be greater than 10']"
        v-model="formData.range"
      />
      <var-uploader
        :rules="[v => v.length >= 1 || 'Upload at least one picture']"
        v-model="formData.files"
      />

      <var-space direction="column" :size="[14, 0]">
        <var-button block type="danger" @click="form.reset()">
          Empty form
        </var-button>
        <var-button block type="warning" @click="form.resetValidation()">
          Empty the validation
        </var-button>
        <var-button block type="success" @click="form.validate()">
          Trigger validation
        </var-button>
        <var-button block type="info" @click="disabled = !disabled">
          Form disabled
        </var-button>
        <var-button block type="primary" @click="readonly = !readonly">
          Form readonly
        </var-button>
      </var-space>
    </var-space>
  </var-form>
</template>
```

### Form Events

You can also use form events to handle form behavior.

```html
<script setup>
import { reactive } from 'vue'
import { Snackbar } from '@varlet/ui'

const formData = reactive({
  username: '',
  password: '',
})

function handleSubmit(valid) {
  Snackbar(`onSubmit: ${valid}`)
}

function handleReset() {
  Snackbar(`onReset`)
}
</script>

<template>
  <var-form @submit="handleSubmit" @reset="handleReset">
    <var-space direction="column" :size="[14, 0]">
      <var-input
        placeholder="Please input username"
        :rules="[v => !!v || 'The username cannot be empty']"
        v-model="formData.username"
      />
      <var-input
        type="password"
        placeholder="Please input password"
        :rules="[v => !!v || 'The password cannot be empty', (v) => v.length >= 8 || 'The password cannot be less than 8 characters']"
        v-model="formData.password"
      />

      <var-space>
        <var-button type="primary" native-type="submit">
          Submit
        </var-button>
        <var-button type="primary" native-type="reset">
          Reset
        </var-button>
      </var-space>
    </var-space>
  </var-form>
</template>
```

### Custom Form Component

If you want to customize the component and access the ability of the form component, the case is as follows.

```html
// playground-ignore
<script setup>
import { Form } from '@varlet/ui'
import { nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  rules: {
    type: Array
  },
  validateTrigger: {
    type: Array,
    default: () => ['onToggle']
  },
  extraMessage: {
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])

const { useForm, useValidation } = Form
const { errorMessage, validateWithTrigger: _validateWithTrigger, validate: _validate, resetValidation } = useValidation()
const { bindForm, form } = useForm()

const reset = () => {
  emit('update:modelValue', false)
  resetValidation()
}

const validate = () => _validate(props.rules, props.modelValue)

const validateWithTrigger = (trigger) => {
  nextTick(() => {
    const { validateTrigger, rules, modelValue } = props
    _validateWithTrigger(validateTrigger, trigger, rules, modelValue)
  })
}

const handleClick = () => {
  if (
    props.readonly ||
    props.disabled ||
    form?.readonly.value ||
    form?.disabled.value
  ) {
    return
  }

  emit('update:modelValue', !props.modelValue)
  validateWithTrigger('onToggle')
}

const apis = {
  reset,
  validate,
  resetValidation
}

defineExpose(apis)
bindForm?.(apis)
</script>

<template>
  <div
    class="var-custom-form-component"
    :class="{
      'var-custom-form-component--disabled': disabled || form?.disabled.value,
      'var-custom-form-component--error': errorMessage,
    }"
  >
    <div class="var-custom-form-component__container"  @click="handleClick">
      <var-icon
        class="var-custom-form-component__icon"
        :name="modelValue ? 'checkbox-marked-circle' : 'close-circle'"
        :transition="250"
      />
      <slot />
    </div>
    <var-form-details :error-message="errorMessage" :extra-message="extraMessage" />
  </div>
</template>

<style>
.var-custom-form-component {
  cursor: pointer;
}

.var-custom-form-component__container {
  display: flex;
  align-items: center;
}

.var-custom-form-component__icon {
  margin-right: 6px;
  font-size: 24px;
}

.var-custom-form-component--disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.var-custom-form-component--error {
  color: var(--color-danger);
}
</style>
```

## API

### Props

#### Form Props

| Prop | Description | Type | Default | 
| --- | --- | --- | --- | 
| `readonly` | Whether the readonly | _boolean_ | `false` |
| `disabled` | Whether the disabled | _boolean_ | `false` |
| `scroll-to-error` | Whether to scroll to the failed form item when the validation fails, the optional value is `start` `end` | _string_ | `-` |
| `scroll-to-error-offset-y` | Scroll to the position offset of the form item that fails validation | _number \| string_ | `0` |

#### FormDetails Props

| Prop | Description | Type | Default | 
|-----------------|---------| --- | -- |
| `error-message` | Error message | _string_ | `-` |
| `extra-message` | Extra message | _string_ | `-` |

### Methods

#### Form Methods

| Method | Description | Arguments | Return |
| --- | --- | --- | --- |
| `validate` | Trigger validation for all form components | `-` | `valid: Promise<boolean>` |
| `resetValidation` | Clear the validation messages for all form components | `-` | `-` |
| `reset` | Clear all form component bindings of values and validation messages | `-` | `-` |

### Events

#### Form Events

| Event | Description  | Arguments  |
| --- | --- | --- |
| `submit` | Triggered when the form is submitted | `valid: boolean` Whether to pass the form verification |
| `reset` | Fired when the form is reset | `-` |

### Slots

#### Form Slots

| Name | Description | SlotProps |
| --- | --- | --- |
| `default` | Form content | `-` |

### Style Variables
Here are the CSS variables used by the component. Styles can be customized using [StyleProvider](#/en-US/style-provider).

#### FormDetails Variables

| Variable                              | Default |
|---------------------------------------| --- |
| `--form-details-error-message-color`  | `var(--color-danger)` |
| `--form-details-extra-message-color`  | `#888` |
| `--form-details-margin-top`           | `6px` |
| `--form-details-font-size`            | `12px` |
| `--form-details-message-margin-right` | `4px` |
