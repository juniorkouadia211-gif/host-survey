/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, GraduationCap, BookOpen, ShieldAlert, Layers } from 'lucide-react';
import BrandEmblem from './BrandEmblem';

interface HeroProps {
  onStartClick: () => void;
}

export default function Hero({ onStartClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-20 sm:pt-12 sm:pb-28 lg:pt-16 lg:pb-32 bg-brand-bg border-b border-brand-border/40">
      {/* Subtle background architectural grid texture (< 1.5% visual weight) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20" 
        style={{
          backgroundImage: `radial-gradient(var(--color-brand-border) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true" 
      />

      {/* Decorative Brand Emblem Watermark in background */}
      <div className="absolute right-0 top-1/4 translate-x-1/3 opacity-5 pointer-events-none hidden xl:block">
        <BrandEmblem size={420} className="text-brand-primary" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-8 text-left">
          
          {/* Header Badge Stack */}
          <div className="flex flex-col items-start gap-3.5">
            {/* Academic badge - moved above the tagline */}
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-none bg-brand-surface text-brand-primary border border-brand-border/80"
            >
              <GraduationCap className="h-4 w-4 text-brand-accent shrink-0" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                Observatoire Socio-Économique
              </span>
            </motion.div>

            {/* Active Study Tagline */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-block text-brand-accent font-mono text-xs sm:text-sm font-semibold uppercase tracking-widest border-b border-brand-accent/30 pb-1"
            >
              Diagnostic Scientifique Actif — Côte d'Ivoire
            </motion.span>
          </div>

          {/* Main Display Headline (IBM Plex Serif, Swiss grid discipline) */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl tracking-tight text-brand-text leading-tight"
              id="study-title"
            >
              Comprendre la vie quotidienne des étudiants en Côte d'Ivoire
            </motion.h1>
            
            <div className="h-1.5 w-24 bg-brand-primary" />
          </div>

          {/* Structured Abstract / Editorial Paragraph */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="border-l-4 border-brand-primary pl-6 space-y-4"
          >
            <p className="text-base sm:text-lg text-brand-text/80 leading-relaxed font-sans font-light">
              Cette étude académique vise à analyser en profondeur les réalités socio-économiques, les habitudes d'apprentissage et les frictions majeures rencontrées au quotidien par les étudiants ivoiriens.
            </p>
            <p className="text-sm text-brand-text/65 leading-relaxed font-sans">
              À travers l'analyse de six dimensions clés (profil académique, mobilité, ressources financières, frictions logistiques, stratégies de résilience et opportunités d'amélioration), nous constituons un corpus de données fiables visant à guider les réformes et inspirer des solutions structurelles concrètes adaptées aux réalités locales.
            </p>
          </motion.div>

          {/* Methodological Pillars Motto (Quiet & structured) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-6 text-[11px] font-mono font-bold uppercase tracking-widest text-brand-primary/80"
          >
            <span className="flex items-center"><span className="h-2 w-2 rounded-none bg-brand-accent mr-2" /> Observer</span>
            <span className="text-brand-border font-light">/</span>
            <span className="flex items-center"><span className="h-2 w-2 rounded-none bg-brand-primary mr-2" /> Comprendre</span>
            <span className="text-brand-border font-light">/</span>
            <span className="flex items-center"><span className="h-2 w-2 rounded-none bg-brand-success mr-2" /> Agir</span>
          </motion.div>

          {/* Central Questionnaire Call-to-Action Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="bg-white border border-brand-border/80 p-6 sm:p-8 rounded-none shadow-xs relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary" />
            <div className="absolute top-0 right-0 h-10 w-10 border-t-2 border-r-2 border-brand-accent/40 pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative z-10">
              <div className="space-y-1.5 max-w-md text-left">
                <h3 className="font-display font-semibold text-lg text-brand-text tracking-tight flex items-center gap-2">
                  <span className="inline-block h-3 w-3 bg-brand-accent" />
                  Participez à la collecte de données
                </h3>
                <p className="text-xs text-brand-text/65 leading-relaxed font-sans">
                  Vos réponses sont totalement confidentielles, sécurisées et traitées de manière agrégée sous un anonymat absolu.
                </p>
              </div>
              
              <button
                onClick={onStartClick}
                className="group inline-flex items-center justify-center px-6 py-4 text-xs font-mono font-bold text-white bg-brand-primary hover:bg-brand-primary/95 active:bg-brand-primary rounded-none transition-colors shadow-xs border border-brand-primary cursor-pointer uppercase tracking-widest shrink-0 w-full sm:w-auto"
                id="start-questionnaire-btn"
              >
                <span>Lancer le diagnostic</span>
                <ArrowRight className="ml-2.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-white/90" />
              </button>
            </div>
          </motion.div>

          {/* Informational Cards (Academic Pillars) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-8 border-t border-brand-border/60 text-left"
          >
            <div className="bg-white p-5 rounded-none border border-brand-border/60 hover:border-brand-primary/40 transition-colors relative">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-brand-primary/40" />
              <div className="h-8 w-8 bg-brand-surface rounded-none border border-brand-border/80 flex items-center justify-center mb-3.5">
                <BookOpen className="h-4 w-4 text-brand-primary" />
              </div>
              <h4 className="font-display font-semibold text-brand-text text-sm sm:text-base">Recherche de Terrain</h4>
              <p className="text-xs text-brand-text/60 mt-2 leading-relaxed font-sans">
                Nous analysons les expériences vécues afin de mieux comprendre le présent et de construire des solutions pour l'avenir.
              </p>
            </div>

            <div className="bg-white p-5 rounded-none border border-brand-border/60 hover:border-brand-accent/40 transition-colors relative">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-brand-accent/40" />
              <div className="h-8 w-8 bg-brand-surface rounded-none border border-brand-border/80 flex items-center justify-center mb-3.5">
                <ShieldAlert className="h-4 w-4 text-brand-accent" />
              </div>
              <h4 className="font-display font-semibold text-brand-text text-sm sm:text-base">Déontologie stricte</h4>
              <p className="text-xs text-brand-text/60 mt-2 leading-relaxed font-sans">
                Toutes les informations recueillies sont traitées de manière agrégée et strictement confidentielle, afin de garantir l'anonymat des répondants et de préserver leur confiance.
              </p>
            </div>

            <div className="bg-white p-5 rounded-none border border-brand-border/60 hover:border-brand-success/40 transition-colors relative">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-brand-success/40" />
              <div className="h-8 w-8 bg-brand-surface rounded-none border border-brand-border/80 flex items-center justify-center mb-3.5">
                <Layers className="h-4 w-4 text-brand-success" />
              </div>
              <h4 className="font-display font-semibold text-brand-text text-sm sm:text-base">Perspectives d'avenir</h4>
              <p className="text-xs text-brand-text/60 mt-2 leading-relaxed font-sans">
                Prochainement, Host Survey mènera des études approfondies pour mieux comprendre les défis rencontrés par les entrepreneurs et PME
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
