'use client';

import {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Sparkles, Type, Image as ImageIcon, Shapes, FolderOpen} from 'lucide-react';
import {cn} from '@/lib/utils';
import type {Product} from '@/lib/products';
import type {Locale} from '@/i18n/settings';
import {TemplatesTab} from './TemplatesTab';
import {TextTab} from './TextTab';
import {ImagesTab} from './ImagesTab';
import {ShapesTab} from './ShapesTab';
import {ProjectsTab} from './ProjectsTab';

export type EditorTab = 'templates' | 'text' | 'images' | 'shapes' | 'projects';

interface EditorSidebarProps {
  product: Product;
  locale: Locale;
  allowShapes: boolean;
  onAddText: () => void;
  onAddShape: (shape: 'rect' | 'circle' | 'triangle') => void;
  onUploadImage: () => void;
  onLoadTemplate: (templateCanvas: Record<string, unknown>) => void;
  onLoadProject: (projectId: string) => void;
}

export function EditorSidebar({
  product,
  locale,
  allowShapes,
  onAddText,
  onAddShape,
  onUploadImage,
  onLoadTemplate,
  onLoadProject
}: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('templates');

  const tabs = [
    {
      id: 'templates' as EditorTab,
      icon: Sparkles,
      label: 'Templates',
      labelKey: 'editor.tabs.templates',
      show: true
    },
    {
      id: 'text' as EditorTab,
      icon: Type,
      label: 'Texte',
      labelKey: 'editor.tabs.text',
      show: true
    },
    {
      id: 'images' as EditorTab,
      icon: ImageIcon,
      label: 'Images',
      labelKey: 'editor.tabs.images',
      show: true
    },
    {
      id: 'shapes' as EditorTab,
      icon: Shapes,
      label: 'Formes',
      labelKey: 'editor.tabs.shapes',
      show: allowShapes
    },
    {
      id: 'projects' as EditorTab,
      icon: FolderOpen,
      label: 'Projets',
      labelKey: 'editor.tabs.projects',
      show: true
    }
  ].filter(tab => tab.show);

  return (
    <div className="flex h-full border-r border-slate-200 bg-white dark:border-white/10 dark:bg-[#171717]">
      {/* Tabs Navigation */}
      <nav className="w-20 flex-shrink-0 border-r border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0f0f0f]">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative flex w-full flex-col items-center gap-1 py-4 transition-colors',
                isActive
                  ? 'bg-white text-brand dark:bg-[#171717]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1f1f1f]'
              )}
              aria-label={tab.label}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-y-0 right-0 w-0.5 bg-brand"
                  transition={{type: 'spring', bounce: 0.2, duration: 0.6}}
                />
              )}
              <Icon size={20} className={cn(isActive && 'text-brand')} aria-hidden />
              <span className="text-[10px] font-medium leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: 20}}
            transition={{duration: 0.2}}
            className="h-full overflow-y-auto p-4"
          >
            {activeTab === 'templates' && (
              <TemplatesTab
                product={product}
                locale={locale}
                onLoadTemplate={onLoadTemplate}
              />
            )}
            {activeTab === 'text' && (
              <TextTab
                locale={locale}
                onAddText={onAddText}
              />
            )}
            {activeTab === 'images' && (
              <ImagesTab
                locale={locale}
                onUploadImage={onUploadImage}
              />
            )}
            {activeTab === 'shapes' && (
              <ShapesTab
                locale={locale}
                onAddShape={onAddShape}
              />
            )}
            {activeTab === 'projects' && (
              <ProjectsTab
                product={product}
                locale={locale}
                onLoadProject={onLoadProject}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
