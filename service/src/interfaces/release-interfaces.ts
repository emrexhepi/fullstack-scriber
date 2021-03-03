export interface Image {
    Height: number;
    ImageType: string;
    Uri: string;
    Width: number;
}

export interface Artist {
    Id: number;
    Name: string;
}

export interface Label {
    CatalogNumber: string;
    Id: string;
    Name: string;
    Role?: any;
}

export interface ExtraArtist {
    Id: number;
    Name: string;
}

export interface Description {
    Description: string;
}

export interface Format {
    FormatName: string;
    Quantity: string;
    Text: string;
    Descriptions: Description[];
}

export interface Genre {
    Genre: string;
}

export interface Style {
    Style: string;
}

export interface MasterId {
    IsMainRelease: string;
    Id: number;
}

export interface TrackList {
    Position: string;
    Title: string;
    Duration: string;
}

export interface Video {
    Duration: number;
    Embed: string;
    Source: string;
    Title: string;
    Description: string;
}

export interface Release {
    Id: string;
    Status: string;
    Images: Image[];
    Artists: Artist[];
    Title: string;
    Labels: Label[];
    ExtraArtists: ExtraArtist[];
    Formats: Format[];
    Genres: Genre[];
    Styles: Style[];
    Country: string;
    Released: string;
    Notes?: any;
    DataQuality: string;
    MasterId: MasterId;
    TrackList: TrackList[];
    Identifiers: any[];
    Videos: Video[];
    Companies: any[];
}

export interface ArtistEntry extends Artist {
    Releases: Release[]
}

export interface Track extends TrackList {
    Release: Release
}
