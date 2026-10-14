import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CustomerForm from './CustomerForm.vue';

describe('CustomerForm', () => {
  it('shows validation errors and does not emit submit for invalid data', async () => {
    const wrapper = mount(CustomerForm, { props: { open: true, customer: null } });
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text()).toContain('Informe ao menos 2 caracteres.');
    expect(wrapper.emitted('submit')).toBeUndefined();
  });

  it('emits submit with trimmed values when the form is valid', async () => {
    const wrapper = mount(CustomerForm, { props: { open: true, customer: null } });
    await wrapper.find('input[type="text"]').setValue('  Ana Souza  ');
    await wrapper.find('input[type="email"]').setValue('ana@example.com');
    await wrapper.find('input[type="tel"]').setValue('11999999999');
    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({
      name: 'Ana Souza',
      email: 'ana@example.com',
      phone: '11999999999',
    });
  });
});
