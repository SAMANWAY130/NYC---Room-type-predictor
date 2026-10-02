from fastapi import FastAPI
import pandas as pd
import joblib
from pydantic import BaseModel,Field
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
model = joblib.load("model (1).pkl")

class result (BaseModel):
    room_type : str 
# Add CORS Middleware to enable communication with Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin
  
    allow_methods=["*"],  # Allows POST, GET, OPTIONS, etc.
    allow_headers=["*"],
)  


class house(BaseModel):
    neighbourhood_group : Literal['Brooklyn', 'Manhattan', 'Queens', 'Staten Island', 'Bronx']
    neighbourhood :Literal['Kensington', 'Midtown', 'Harlem', 'Clinton Hill', 'East Harlem',
       'Murray Hill', 'Bedford-Stuyvesant', "Hell's Kitchen",
       'Upper West Side', 'Chinatown', 'South Slope', 'West Village',
       'Williamsburg', 'Fort Greene', 'Chelsea', 'Crown Heights',
       'Park Slope', 'Windsor Terrace', 'Inwood', 'East Village',
       'Greenpoint', 'Bushwick', 'Flatbush', 'Lower East Side',
       'Prospect-Lefferts Gardens', 'Long Island City', 'Kips Bay',
       'SoHo', 'Upper East Side', 'Prospect Heights',
       'Washington Heights', 'Woodside', 'Brooklyn Heights',
       'Carroll Gardens', 'Gowanus', 'Flatlands', 'Cobble Hill',
       'Flushing', 'Boerum Hill', 'Sunnyside', 'DUMBO', 'St. George',
       'Highbridge', 'Financial District', 'Ridgewood',
       'Morningside Heights', 'Jamaica', 'Middle Village', 'NoHo',
       'Ditmars Steinway', 'Flatiron District', 'Roosevelt Island',
       'Greenwich Village', 'Little Italy', 'East Flatbush',
       'Tompkinsville', 'Astoria', 'Clason Point', 'Eastchester',
       'Kingsbridge', 'Two Bridges', 'Queens Village', 'Rockaway Beach',
       'Forest Hills', 'Nolita', 'Woodlawn', 'University Heights',
       'Gravesend', 'Gramercy', 'Allerton', 'East New York',
       'Theater District', 'Concourse Village', 'Sheepshead Bay',
       'Emerson Hill', 'Fort Hamilton', 'Bensonhurst', 'Tribeca',
       'Shore Acres', 'Sunset Park', 'Concourse', 'Elmhurst',
       'Brighton Beach', 'Jackson Heights', 'Cypress Hills', 'St. Albans',
       'Arrochar', 'Rego Park', 'Wakefield', 'Clifton', 'Bay Ridge',
       'Graniteville', 'Spuyten Duyvil', 'Stapleton', 'Briarwood',
       'Ozone Park', 'Columbia St', 'Vinegar Hill', 'Mott Haven',
       'Longwood', 'Canarsie', 'Battery Park City', 'Civic Center',
       'East Elmhurst', 'New Springville', 'Morris Heights', 'Arverne',
       'Cambria Heights', 'Tottenville', 'Mariners Harbor', 'Concord',
       'Borough Park', 'Bayside', 'Downtown Brooklyn', 'Port Morris',
       'Fieldston', 'Kew Gardens', 'Midwood', 'College Point',
       'Mount Eden', 'City Island', 'Glendale', 'Port Richmond',
       'Red Hook', 'Richmond Hill', 'Bellerose', 'Maspeth',
       'Williamsbridge', 'Soundview', 'Woodhaven', 'Woodrow',
       'Co-op City', 'Stuyvesant Town', 'Parkchester', 'North Riverdale',
       'Dyker Heights', 'Bronxdale', 'Sea Gate', 'Riverdale',
       'Kew Gardens Hills', 'Bay Terrace', 'Norwood', 'Claremont Village',
       'Whitestone', 'Fordham', 'Bayswater', 'Navy Yard', 'Brownsville',
       'Eltingville', 'Fresh Meadows', 'Mount Hope', 'Lighthouse Hill',
       'Springfield Gardens', 'Howard Beach', 'Belle Harbor',
       'Jamaica Estates', 'Van Nest', 'Morris Park', 'West Brighton',
       'Far Rockaway', 'South Ozone Park', 'Tremont', 'Corona',
       'Great Kills', 'Manhattan Beach', 'Marble Hill', 'Dongan Hills',
       'Castleton Corners', 'East Morrisania', 'Hunts Point', 'Neponsit',
       'Pelham Bay', 'Randall Manor', 'Throgs Neck', 'Todt Hill',
       'West Farms', 'Silver Lake', 'Morrisania', 'Laurelton',
       'Grymes Hill', 'Holliswood', 'Pelham Gardens', 'Belmont',
       'Rosedale', 'Edgemere', 'New Brighton', 'Midland Beach',
       'Baychester', 'Melrose', 'Bergen Beach', 'Richmondtown',
       'Howland Hook', 'Schuylerville', 'Coney Island', 'New Dorp Beach',
       "Prince's Bay", 'South Beach', 'Bath Beach', 'Jamaica Hills',
       'Oakwood', 'Castle Hill', 'Hollis', 'Douglaston', 'Huguenot',
       'Olinville', 'Edenwald', 'Grant City', 'Westerleigh',
       'Bay Terrace, Staten Island', 'Westchester Square', 'Little Neck',
       'Fort Wadsworth', 'Rosebank', 'Unionport', 'Mill Basin',
       'Arden Heights', "Bull's Head", 'New Dorp', 'Rossville',
       'Breezy Point', 'Willowbrook']
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    price : float = Field(gt=0)
    minimum_nights :float
    number_of_reviews : float
    reviews_per_month : float
    calculated_host_listings_count :float
    availability_365 : float




@app.get('/')
def greet ():
    return "YOKOSO SOUL SOCIETY"

@app.post('/predict/')
def predict (data : house):
    df = pd.DataFrame([{

        "neighbourhood_group": data.neighbourhood_group,
        "neighbourhood": data.neighbourhood,
        "latitude": data.latitude,
        "longitude": data.longitude,
        "price": data.price,
        "minimum_nights": data.minimum_nights,
        "number_of_reviews": data.number_of_reviews,
        "reviews_per_month": data.reviews_per_month,
        "calculated_host_listings_count": data.calculated_host_listings_count,
        "availability_365": data.availability_365   
        }])
    
    prediction = model.predict(df)[0]
    return result(room_type=prediction)
    
