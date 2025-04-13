import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderFormSchema, OrderFormData } from '@/lib/schema';

type OrderFormProps = {
  onSubmit: (data: OrderFormData) => void;
  bookId: string;
  isLoading?: boolean;
  pdfPrice?: number;
  softcoverPrice?: number;
  hardcoverPrice?: number;
};

export default function OrderForm({ 
  onSubmit, 
  bookId, 
  isLoading = false,
  pdfPrice = 5.99,
  softcoverPrice = 19.99,
  hardcoverPrice = 27.99
}: OrderFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      bookId,
      format: 'pdf',
      quantity: 1,
    },
  });

  const selectedFormat = watch('format');
  const quantity = watch('quantity');

  const needsShippingAddress = selectedFormat !== 'pdf';
  
  const getPrice = () => {
    switch (selectedFormat) {
      case 'pdf':
        return pdfPrice;
      case 'softcover':
        return softcoverPrice * quantity;
      case 'hardcover':
        return hardcoverPrice * quantity;
      default:
        return 0;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Commander votre livre</h2>
        
        <input
          type="hidden"
          {...register('bookId')}
          value={bookId}
        />
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Choisissez votre format</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`border rounded-lg p-4 ${selectedFormat === 'pdf' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
              <label className="flex items-start cursor-pointer">
                <input
                  type="radio"
                  value="pdf"
                  {...register('format')}
                  className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  disabled={isLoading}
                />
                <div className="ml-3">
                  <span className="block font-medium">PDF</span>
                  <span className="block text-sm text-gray-500">Téléchargement instantané</span>
                  <span className="block font-semibold mt-2">{pdfPrice.toFixed(2)}€</span>
                </div>
              </label>
            </div>
            
            <div className={`border rounded-lg p-4 ${selectedFormat === 'softcover' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
              <label className="flex items-start cursor-pointer">
                <input
                  type="radio"
                  value="softcover"
                  {...register('format')}
                  className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  disabled={isLoading}
                />
                <div className="ml-3">
                  <span className="block font-medium">Couverture souple</span>
                  <span className="block text-sm text-gray-500">Livraison en 5-10 jours</span>
                  <span className="block font-semibold mt-2">{softcoverPrice.toFixed(2)}€</span>
                </div>
              </label>
            </div>
            
            <div className={`border rounded-lg p-4 ${selectedFormat === 'hardcover' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
              <label className="flex items-start cursor-pointer">
                <input
                  type="radio"
                  value="hardcover"
                  {...register('format')}
                  className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  disabled={isLoading}
                />
                <div className="ml-3">
                  <span className="block font-medium">Couverture rigide</span>
                  <span className="block text-sm text-gray-500">Qualité premium</span>
                  <span className="block font-semibold mt-2">{hardcoverPrice.toFixed(2)}€</span>
                </div>
              </label>
            </div>
          </div>
          
          {errors.format && (
            <p className="mt-1 text-sm text-red-600">{errors.format.message}</p>
          )}
        </div>
        
        {selectedFormat !== 'pdf' && (
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantité
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              max={10}
              {...register('quantity')}
              className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
            )}
          </div>
        )}
        
        {needsShippingAddress && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Adresse de livraison</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  id="fullName"
                  type="text"
                  {...register('shippingAddress.fullName')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                />
                {errors.shippingAddress?.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.fullName.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  id="addressLine1"
                  type="text"
                  {...register('shippingAddress.addressLine1')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                />
                {errors.shippingAddress?.addressLine1 && (
                  <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.addressLine1.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                  Complément d'adresse (optionnel)
                </label>
                <input
                  id="addressLine2"
                  type="text"
                  {...register('shippingAddress.addressLine2')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  id="city"
                  type="text"
                  {...register('shippingAddress.city')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                />
                {errors.shippingAddress?.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.city.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <input
                  id="postalCode"
                  type="text"
                  {...register('shippingAddress.postalCode')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                />
                {errors.shippingAddress?.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.postalCode.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Pays
                </label>
                <select
                  id="country"
                  {...register('shippingAddress.country')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                >
                  <option value="">Sélectionner...</option>
                  <option value="FR">France</option>
                  <option value="BE">Belgique</option>
                  <option value="CH">Suisse</option>
                  <option value="LU">Luxembourg</option>
                  <option value="CA">Canada</option>
                </select>
                {errors.shippingAddress?.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.country.message}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Total</h3>
            <p className="text-gray-500">
              {selectedFormat === 'pdf' ? 'Téléchargement instantané' : 'Livraison incluse'}
            </p>
          </div>
          <div className="text-2xl font-bold">{getPrice().toFixed(2)}€</div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Traitement en cours...' : 'Procéder au paiement'}
        </button>
      </div>
    </form>
  );
}
