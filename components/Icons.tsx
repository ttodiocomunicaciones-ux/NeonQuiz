import React from 'react';
import { 
  Car, Globe, Gamepad2, Rocket, Waves, 
  TrendingUp, Library, Crown, Star, Lock, Play, Zap, Heart, Share2, Home, RefreshCw,
  Utensils, Cpu, Trophy, User, Video, CreditCard, LogOut, ArrowLeft, Clock, Brain, X,
  Atom, Sigma, Scroll, FlaskConical, Palette, MessageCircle, Send, Gem, CheckCircle, Mail
} from 'lucide-react';

export const Icons: Record<string, React.FC<any>> = {
  Car, Globe, Gamepad2, Rocket, Waves, 
  TrendingUp, Library, Crown, Star, Lock, Play, Zap, Heart, Share2, Home, RefreshCw,
  Utensils, Cpu, Trophy, User, Video, CreditCard, LogOut, ArrowLeft, Clock, Brain, X,
  Atom, Sigma, Scroll, FlaskConical, Palette, MessageCircle, Send, Gem, CheckCircle, Mail
};

export const GetIcon = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = Icons[name] || Icons['Star']; // Fallback
  return <IconComponent className={className} />;
};