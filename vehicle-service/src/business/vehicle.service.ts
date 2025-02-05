import axios from 'axios';
import {Config} from "../../config";

interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    fuelType: string;
    drive: string;
}

export const fetchVehicles = async (filters?: { make?: string; model?: string }): Promise<Vehicle[]> => {
    try {
        console.log('Fetching vehicles from:', Config.api.url);

        const params: Record<string, any> = {
            select: 'id,make,model,year,fueltype,drive',
            limit: 100,
        };

        // Přidání podmínek do where klauzule
        const whereConditions: string[] = [];
        if (filters?.make) {
            whereConditions.push(`search(make, "${filters.make}")`);
        }
        if (filters?.model) {
            whereConditions.push(`search(model, "${filters.model}")`);
        }
        if (whereConditions.length > 0) {
            params.where = whereConditions.join(' AND ');
        }

        console.log('Request params:', params);

        const response = await axios.get(Config.api.url, { params });

        console.log('Response data:', response.data);

        // Ověření, že odpověď obsahuje pole 'results' místo 'records'
        if (!response.data || !response.data.results) {
            throw new Error('Response does not contain results');
        }

        // Mapování odpovědi na požadovanou strukturu
        return response.data.results.map((record: any) => ({
            id: record.id,
            make: record.make,
            model: record.model,
            year: parseInt(record.year, 10),
            fuelType: record.fueltype,
            drive: record.drive,
        }));
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw new Error('Failed to fetch vehicles');
    }
};



export const fetchVehiclesByMake = async (make: string): Promise<Vehicle[]> => {
    return fetchVehicles({ make });
};

export const fetchVehiclesByModel = async (model: string): Promise<Vehicle[]> => {
    return fetchVehicles({ model });
};

export const fetchVehiclesByMakeAndModel = async (make: string, model: string): Promise<Vehicle[]> => {
    return fetchVehicles({ make, model });
};

