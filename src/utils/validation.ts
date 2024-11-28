// src/utils/validation.ts
import * as yup from 'yup';

export const productSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  variations: yup.array().of(
    yup.object({
      color: yup.string().required('Cor é obrigatória'),
      stockQuantity: yup
        .number()
        .required('Quantidade é obrigatória')
        .min(0, 'Quantidade deve ser positiva')
        .integer('Quantidade deve ser um número inteiro'),
      price: yup
        .number()
        .required('Preço é obrigatório')
        .min(0, 'Preço deve ser positivo')
    })
  ).min(1, 'Adicione pelo menos uma variação')
});

// src/components/ProductForm/index.tsx
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { productSchema } from '../../utils/validation';

export default function ProductForm() {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      variations: [{ color: '', stockQuantity: 0, price: 0 }]
    }
  });
  
  // Resto do componente permanece igual...
}