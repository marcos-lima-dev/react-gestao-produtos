// src/components/ProductForm/index.tsx
import { useForm, useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addProduct } from '../../store/productsSlice';
import { Product } from '../../types';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().required('Nome do produto é obrigatório'),
  variations: yup.array().of(
    yup.object({
      id: yup.string(),
      color: yup.string().required('Cor é obrigatória'),
      stockQuantity: yup.number()
        .required('Quantidade é obrigatória')
        .min(1, 'Quantidade deve ser maior que zero'),
      price: yup.number()
        .required('Preço é obrigatório')
        .min(0.01, 'Preço deve ser maior que zero')
    })
  ).min(1, 'Adicione pelo menos uma variação')
});

type FormData = yup.InferType<typeof schema>;

export default function ProductForm() {
  const dispatch = useDispatch();
  const { register, control, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      variations: [{ id: '', color: '', stockQuantity: 0, price: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variations'
  });

  const productName = watch('name');
  const variations = watch('variations') || [];
  const isFormValid = productName && variations?.length > 0 && variations.every(v => v.color && v.stockQuantity > 0 && v.price > 0);

  const onSubmit = (data: FormData) => {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: data.name,
      variations: (data.variations || []).map(variation => ({
        id: crypto.randomUUID(),
        color: variation.color,
        stockQuantity: Number(variation.stockQuantity),
        price: Number(variation.price)
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    dispatch(addProduct(newProduct));
    toast.success('Produto criado com sucesso!');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nome do Produto
        </label>
        <input
          type="text"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Variações</h3>
          <button
            type="button"
            onClick={() => append({ id: '', color: '', stockQuantity: 0, price: 0 })}
            disabled={!productName}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Adicionar Variação
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-md space-y-4">
            <div className="flex justify-between">
              <h4 className="text-sm font-medium">Variação {index + 1}</h4>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remover
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cor
                </label>
                <input
                  type="text"
                  {...register(`variations.${index}.color`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.variations?.[index]?.color && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.variations[index]?.color?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantidade
                </label>
                <input
                  type="number"
                  {...register(`variations.${index}.stockQuantity`)}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.variations?.[index]?.stockQuantity && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.variations[index]?.stockQuantity?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preço
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register(`variations.${index}.price`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.variations?.[index]?.price && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.variations[index]?.price?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isFormValid}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Salvar Produto
        </button>
      </div>
    </form>
  );
}