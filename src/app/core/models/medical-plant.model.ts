import { Image } from "./image.model";
import { Family } from "./family.model";

export interface MedicinalPlant {
    id?: number;
    vietnameseName: string;
    scientificName: string;
    partUsed?: string;
    description?: string;
    habitat?: string;
    chemicalComposition?: string;
    usage?: string;
    effect?: string;
    search_count?: number;
    familyId?: number;
    family?: Family;
    rareLevel?: number;
    summaryEffect?: string;
    images: Image[];
}