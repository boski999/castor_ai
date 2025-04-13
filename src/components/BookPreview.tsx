import React from 'react';

type BookPreviewProps = {
  title: string;
  pages: {
    text: string;
    imageUrl?: string;
  }[];
  previewPercentage?: number;
  onPurchase: () => void;
};

export default function BookPreview({ title, pages, previewPercentage = 35, onPurchase }: BookPreviewProps) {
  // Calculer le nombre de pages à afficher dans la prévisualisation
  const totalPages = pages.length;
  const previewPages = Math.ceil(totalPages * (previewPercentage / 100));
  
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">{title}</h2>
        
        {/* Couverture */}
        {pages[0]?.imageUrl && (
          <div className="mb-8 flex justify-center">
            <img 
              src={pages[0].imageUrl} 
              alt="Couverture du livre" 
              className="rounded-lg shadow-md max-h-96"
            />
          </div>
        )}
        
        {/* Pages de prévisualisation */}
        <div className="space-y-12">
          {pages.slice(0, previewPages).map((page, index) => (
            <div key={index} className="border-b pb-8 last:border-b-0">
              <h3 className="text-lg font-semibold mb-4">Page {index + 1}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {page.imageUrl && (
                  <div className="flex justify-center items-center">
                    <img 
                      src={page.imageUrl} 
                      alt={`Illustration page ${index + 1}`} 
                      className="rounded-lg shadow-sm max-h-64"
                    />
                  </div>
                )}
                
                <div>
                  <p className="text-gray-700">{page.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Message de limite de prévisualisation */}
        {totalPages > previewPages && (
          <div className="mt-12 bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-indigo-700 mb-2">
              Vous visualisez {previewPercentage}% du livre
            </h3>
            <p className="text-indigo-600 mb-6">
              Débloquez l'accès complet pour continuer l'histoire !
            </p>
            <button
              onClick={onPurchase}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Obtenir le livre complet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
