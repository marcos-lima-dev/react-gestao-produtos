// src/components/ProductList/EditModal.tsx
import { useForm, useFieldArray } from 'react-hook-form';
import { Product } from '../../types/product';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface EditModalProps {
  product: Product;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const schema = yup.object({
  name: yup.string().required('Nome do produto é obrigatório'),
  variations: yup.array().of(
    yup.object({
      color: yup.string().required('Cor é obrigatória'),
      stockQuantity: yup.number()
        .required('Quantidade é obrigatória')
        .min(0, 'Quantidade deve ser positiva'),
      price: yup.number()
        .required('Preço é obrigatório')
        .min(0, 'Preço deve ser positivo')
    })
  ).min(1, 'Adicione pelo menos uma variação')
});

export default function EditModal({ product, onClose, onSave }: EditModalProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: product.name,
      variations: product.variations
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variations'
  });

  const onSubmit = (data: any) => {
    onSave({
      ...product,
      ...data,
      updatedAt: new Date()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg p-8 m-4 max-w-xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Editar Produto</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

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
                onClick={() => append({ color: '', stockQuantity: 0, price: 0 })}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      {...register(`variations.${index}.stockQuantity`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Preço
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`variations.${index}.price`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}