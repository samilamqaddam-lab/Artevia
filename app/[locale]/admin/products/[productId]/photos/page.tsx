/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import {
  Upload,
  Star,
  Trash2,
  Edit3,
  Link,
  Save,
  ArrowLeft,
  Loader2,
  GripVertical,
  ExternalLink
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDropzone } from 'react-dropzone';
import { getProductBySlug } from '@/lib/products';
import { toast } from 'sonner';

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  image_type: 'local' | 'external' | 'uploaded';
  storage_path?: string;
  is_hero: boolean;
  display_order: number;
  alt_text?: string;
  attribution?: {
    title?: string;
    source?: string;
    link?: string;
  };
  created_at: string;
  updated_at: string;
}

interface DraggableImageProps {
  image: ProductImage;
  index: number;
  moveImage: (dragIndex: number, dropIndex: number) => void;
  onSetHero: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const DraggableImage = ({ image, index, moveImage, onSetHero, onDelete, onEdit }: DraggableImageProps) => {
  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      drag(drop(node));
    }
  }, []);

  const [{ isDragging }, drag] = useDrag({
    type: 'image',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'image',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={ref}
      className={`relative group bg-white dark:bg-[#171717] rounded-lg border-2 transition-all ${
        isDragging ? 'opacity-50' : ''
      } ${
        isOver ? 'border-brand' : 'border-slate-200 dark:border-slate-700'
      } ${
        image.is_hero ? 'ring-2 ring-brand ring-offset-2' : ''
      }`}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
        <div className="bg-white/90 dark:bg-black/90 rounded p-1">
          <GripVertical size={16} className="text-slate-600 dark:text-slate-400" />
        </div>
      </div>

      {/* Hero Badge */}
      {image.is_hero && (
        <div className="absolute top-2 right-2 z-10 bg-brand text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Star size={12} fill="currentColor" />
          <span>Principal</span>
        </div>
      )}

      {/* Image */}
      <div className="aspect-square relative overflow-hidden rounded-t-lg">
        <Image
          src={image.image_url}
          alt={image.alt_text || 'Product image'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 200px"
        />
      </div>

      {/* Actions */}
      <div className="p-2 flex items-center justify-between">
        <div className="flex gap-1">
          {!image.is_hero && (
            <button
              onClick={onSetHero}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Définir comme photo principale"
            >
              <Star size={16} className="text-slate-600 dark:text-slate-400" />
            </button>
          )}
          <button
            onClick={onEdit}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Modifier"
          >
            <Edit3 size={16} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        <button
          onClick={onDelete}
          className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="Supprimer"
        >
          <Trash2 size={16} className="text-red-600 dark:text-red-400" />
        </button>
      </div>

      {/* Attribution */}
      {image.attribution?.source && (
        <div className="px-2 pb-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {image.attribution.source}
          </div>
        </div>
      )}
    </div>
  );
};

export default function ProductPhotosPage() {
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const productId = params.productId as string;

  const [product, setProduct] = useState<any>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<ProductImage | null>(null);
  const [showUrlImport, setShowUrlImport] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importAltText, setImportAltText] = useState('');
  const [editAltText, setEditAltText] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Load product and images
  useEffect(() => {
    loadData();
  }, [productId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Get product details
      const productData = getProductBySlug(productId);
      setProduct(productData);

      // Get images from API
      const response = await fetch(`/api/admin/products/${productId}/images`);
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // File upload handler
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    acceptedFiles.forEach(file => {
      formData.append('images', file);
      formData.append('altTexts', ''); // Can be enhanced to prompt for alt text
    });

    try {
      const response = await fetch(`/api/admin/products/${productId}/images`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`${data.images.length} image(s) uploadée(s) avec succès`);
        await loadData();
      } else {
        toast.error('Erreur lors de l\'upload');
      }

      if (data.errors && data.errors.length > 0) {
        data.errors.forEach((err: any) => {
          toast.error(`${err.file}: ${err.error}`);
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  }, [productId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  // Move image for drag and drop
  const moveImage = useCallback((dragIndex: number, dropIndex: number) => {
    const draggedImage = images[dragIndex];
    const newImages = [...images];
    newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    setImages(newImages);
    setHasChanges(true);
  }, [images]);

  // Save reordering
  const saveOrder = async () => {
    setSaving(true);
    const imageIds = images.map(img => img.id);

    try {
      const response = await fetch(`/api/admin/products/${productId}/images/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageIds })
      });

      if (response.ok) {
        toast.success('Ordre des images sauvegardé');
        setHasChanges(false);
      } else {
        toast.error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Set hero image
  const setHeroImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setAsHero: true })
      });

      if (response.ok) {
        toast.success('Photo principale définie');
        await loadData();
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Set hero error:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // Delete image
  const deleteImage = async (imageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Image supprimée');
        await loadData();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  // Import from URL
  const importFromUrl = async () => {
    if (!importUrl) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: importUrl,
          altText: importAltText
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Image importée avec succès');
        setImportUrl('');
        setImportAltText('');
        setShowUrlImport(false);
        await loadData();
      } else {
        toast.error(data.error || 'Erreur lors de l\'import');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Erreur lors de l\'import');
    }
  };

  // Update alt text
  const updateAltText = async () => {
    if (!editingImage) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}/images/${editingImage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt_text: editAltText })
      });

      if (response.ok) {
        toast.success('Texte alternatif mis à jour');
        setEditingImage(null);
        setEditAltText('');
        await loadData();
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/${locale}/admin/products`)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Gestion des Photos
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {product?.name || 'Produit'} - {images.length} image{images.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasChanges && (
                <button
                  onClick={saveOrder}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand-600 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  <span>Enregistrer l&apos;ordre</span>
                </button>
              )}
            </div>
          </div>

          {/* Upload Zone */}
          <div className="mb-8">
            <div
              {...getRootProps()}
              className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                isDragActive
                  ? 'border-brand bg-brand/5'
                  : 'border-slate-300 dark:border-slate-700 hover:border-brand'
              }`}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin text-brand" size={32} />
                  <p className="text-slate-600 dark:text-slate-400">Upload en cours...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="text-slate-400" size={32} />
                  <p className="text-slate-600 dark:text-slate-400">
                    {isDragActive
                      ? 'Déposez les images ici'
                      : 'Glissez-déposez des images ou cliquez pour sélectionner'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    JPG, PNG, WebP, GIF - Max 10MB
                  </p>
                </div>
              )}
            </div>

            {/* URL Import */}
            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                onClick={() => setShowUrlImport(!showUrlImport)}
                className="flex items-center gap-2 text-brand hover:underline"
              >
                <Link size={16} />
                <span>Importer depuis une URL</span>
              </button>
            </div>

            {showUrlImport && (
              <div className="mt-4 rounded-lg bg-white dark:bg-[#171717] p-4 border border-slate-200 dark:border-slate-700">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">URL de l'image</label>
                    <input
                      type="url"
                      value={importUrl}
                      onChange={(e) => setImportUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0a0a0a] px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Texte alternatif (optionnel)</label>
                    <input
                      type="text"
                      value={importAltText}
                      onChange={(e) => setImportAltText(e.target.value)}
                      placeholder="Description de l'image"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0a0a0a] px-3 py-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={importFromUrl}
                      disabled={!importUrl}
                      className="rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand-600 disabled:opacity-50"
                    >
                      Importer
                    </button>
                    <button
                      onClick={() => {
                        setShowUrlImport(false);
                        setImportUrl('');
                        setImportAltText('');
                      }}
                      className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Images Grid */}
          {images.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
              <Upload className="mx-auto mb-4 text-slate-400" size={48} />
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Aucune image pour ce produit
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
                Commencez par uploader des images
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <DraggableImage
                  key={image.id}
                  image={image}
                  index={index}
                  moveImage={moveImage}
                  onSetHero={() => setHeroImage(image.id)}
                  onDelete={() => deleteImage(image.id)}
                  onEdit={() => {
                    setEditingImage(image);
                    setEditAltText(image.alt_text || '');
                  }}
                />
              ))}
            </div>
          )}

          {/* Edit Modal */}
          {editingImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-lg bg-white dark:bg-[#171717] p-6">
                <h3 className="text-lg font-semibold mb-4">Modifier l'image</h3>

                <div className="mb-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={editingImage.image_url}
                      alt={editingImage.alt_text || ''}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Texte alternatif</label>
                  <input
                    type="text"
                    value={editAltText}
                    onChange={(e) => setEditAltText(e.target.value)}
                    placeholder="Description de l'image pour l'accessibilité"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0a0a0a] px-3 py-2"
                  />
                </div>

                {editingImage.attribution && (
                  <div className="mb-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Source: {editingImage.attribution.source}
                    </p>
                    {editingImage.attribution.link && (
                      <a
                        href={editingImage.attribution.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brand hover:underline flex items-center gap-1"
                      >
                        Voir l'original
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={updateAltText}
                    className="flex-1 rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand-600"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => {
                      setEditingImage(null);
                      setEditAltText('');
                    }}
                    className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}