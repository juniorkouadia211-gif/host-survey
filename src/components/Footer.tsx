/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mail, Globe, Shield, ShieldCheck } from 'lucide-react';
import BrandEmblem from './BrandEmblem';

export default function Footer() {
  return (
    <footer className="bg-[#F4F4F1] text-brand-text border-t border-brand-border py-16 font-sans relative overflow-hidden">
      {/* Editorial geometric separator line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-success" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center space-x-3">
              <BrandEmblem className="h-8 w-8 text-brand-primary shrink-0" />
              <span className="font-display font-semibold text-lg tracking-tight text-brand-text">
                HOST <span className="text-brand-primary font-normal">Survey</span>
              </span>
            </div>
            
            {/* Slogan */}
            <p className="text-brand-accent font-medium text-xs uppercase tracking-widest font-mono">
              Observer. Comprendre. Agir.
            </p>

            <p className="text-brand-text/75 text-xs sm:text-sm leading-relaxed max-w-sm font-sans font-light">
              HOST Survey est une plateforme de recherche conçue pour collecter, structurer et analyser les données issues des enquêtes de terrain afin d'éclairer la prise de décision et concevoir l'avenir.
            </p>
          </div>

          {/* Quick links & contact */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 md:pt-0">
            <div className="border-t-2 border-brand-primary pt-4">
              <h4 className="text-xs font-bold text-brand-primary uppercase tracking-widest font-mono mb-4">Notre mission</h4>
              <p className="text-brand-text/70 text-xs leading-relaxed font-sans font-light">
                Contribuer à une meilleure compréhension des réalités étudiantes grâce à des données fiables, des analyses rigoureuses et des outils adaptés aux chercheurs, institutions et organisations engagées dans le développement.
              </p>
            </div>

            <div className="border-t-2 border-brand-accent pt-4">
              <ul className="space-y-3.5 text-xs text-brand-text/80 font-mono">
                <li className="flex items-center space-x-2">
                  <Shield className="h-3.5 w-3.5 text-brand-success shrink-0" />
                  <span className="font-semibold">Anonymat total</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="h-3.5 w-3.5 text-brand-success shrink-0" />
                  <span className="break-all">kefbat18@gmail.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Globe className="h-3.5 w-3.5 text-brand-success shrink-0" />
                  <span>Abidjan, Côte d'Ivoire</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom certification / institutional logos */}
        <div className="mt-16 pt-8 border-t border-brand-border/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6 text-brand-text/45 font-mono text-[10px] uppercase tracking-wider">
            <span className="border border-brand-border p-1.5 bg-white/50">
              MÉTHODE OCC V1.0
            </span>
            <span className="border border-brand-border p-1.5 bg-white/50">
              AFRICA STUDENT OBSERVATORY
            </span>
          </div>
        </div>

        {/* Bottom copyright banner */}
        <div className="mt-8 pt-6 border-t border-brand-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-text/50 font-mono">
          <p>© {new Date().getFullYear()} HOST Survey. Tous droits de recherche réservés.</p>
        </div>
      </div>
    </footer>
  );
}
