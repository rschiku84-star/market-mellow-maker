import { generateScript } from "../../ai/generateScript";
import { generateCaption } from "../../ai/generateCaption";
import { generateHashtags } from "../../ai/generateHashtags";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Product } from "@/hooks/useProducts";
