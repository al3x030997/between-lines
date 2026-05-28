import type { ReaderProfile } from '@/lib/mock-readers';
import {
  CreditsStrip,
  MyLine,
  NowGrid,
  ProfileHero,
  ProfileSection,
  TagList,
} from './primitives';
import {
  LibraryBlock,
  Memorables,
  OtherPlaces,
  ReadingCirclesBlock,
  SitWithAnyone,
  WishCards,
} from './sections-shared';
import { BookPair } from './sections-writer';
import {
  BooksThatUndidMeBlock,
  FavouriteAuthorsBlock,
  GenrePassionBlock,
  HowIReadBlock,
  WhenBookBecameFilmBlock,
} from './sections-reader';

/**
 * The full reader-profile body. Shared between /profile (self) and
 * /reader/[handle] (public). Accepts an `editable` flag from a wrapper.
 */
export function ReaderProfileView({ profile, editable }: { profile: ReaderProfile; editable: boolean }) {
  return (
    <>
      <ProfileHero hero={profile.hero} editable={editable} />

      <NowGrid cards={profile.now} />

      <CreditsStrip items={profile.credits} />

      {profile.memorables.length > 0 ? (
        <ProfileSection title="The Memorables" editable={editable}>
          <Memorables items={profile.memorables} />
          {profile.otherCharactersILove.length > 0 ? (
            <div className="br-pf-field" style={{ marginTop: '1.25rem' }}>
              <div className="br-pf-field-label">Other characters I love</div>
              <TagList tags={profile.otherCharactersILove} />
            </div>
          ) : null}
          {profile.myLine ? (
            <MyLine label={profile.myLine.label} text={profile.myLine.text} attribution={profile.myLine.attribution} />
          ) : null}
        </ProfileSection>
      ) : null}

      {profile.gotAway.length > 0 ? <WishCards items={profile.gotAway} /> : null}

      {profile.library.body || profile.library.tbr.length > 0 ? (
        <ProfileSection title="What You'd Find in My Library" editable={editable}>
          <LibraryBlock body={profile.library.body} tbr={profile.library.tbr} />
        </ProfileSection>
      ) : null}

      {profile.last3Read.length > 0 || profile.allTimeFavourites.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1.25rem' }}>
          <ProfileSection title="Last Three Read" editable={editable}>
            <BookPair last3={profile.last3Read} allTime={[]} last3Label=" " allTimeLabel=" " />
          </ProfileSection>
        </div>
      ) : null}

      {profile.howIRead.length > 0 ? (
        <ProfileSection title="How I Read" editable={editable}>
          <HowIReadBlock items={profile.howIRead} genres={profile.favouriteGenres} />
        </ProfileSection>
      ) : null}

      {profile.favouriteAuthors.recently.length > 0 ||
      profile.favouriteAuthors.allTime.length > 0 ||
      profile.favouriteAuthors.onPlatform.length > 0 ? (
        <ProfileSection title="My Favourite Authors" editable={editable}>
          <FavouriteAuthorsBlock data={profile.favouriteAuthors} />
        </ProfileSection>
      ) : null}

      {profile.booksThatUndidMe.length > 0 ? (
        <ProfileSection title="Books That Undid Me" editable={editable}>
          <BooksThatUndidMeBlock items={profile.booksThatUndidMe} />
        </ProfileSection>
      ) : null}

      {profile.whenBookBecameFilm.length > 0 ? (
        <ProfileSection title="When the Book Became a Film" editable={editable}>
          <WhenBookBecameFilmBlock items={profile.whenBookBecameFilm} />
        </ProfileSection>
      ) : null}

      {profile.genrePassion ? (
        <ProfileSection title="My Genre Passions" editable={editable}>
          <GenrePassionBlock data={profile.genrePassion} />
        </ProfileSection>
      ) : null}

      {profile.readingCircles.clubs.length > 0 || profile.readingCircles.pods.length > 0 ? (
        <ProfileSection title="My Reading Circles" editable={editable}>
          <ReadingCirclesBlock
            open={profile.readingCircles.open}
            clubs={profile.readingCircles.clubs}
            pods={profile.readingCircles.pods}
            editable={editable}
          />
        </ProfileSection>
      ) : null}

      {profile.sitWithAnyone ? (
        <ProfileSection title="If I Could Sit With Anyone" editable={editable}>
          <SitWithAnyone
            label={profile.sitWithAnyone.label}
            body={profile.sitWithAnyone.body}
            haiku={profile.sitWithAnyone.haiku}
          />
        </ProfileSection>
      ) : null}

      {profile.otherPlaces.length > 0 ? (
        <ProfileSection title="Other Places You Can Find Me" editable={editable}>
          <OtherPlaces links={profile.otherPlaces} />
        </ProfileSection>
      ) : null}
    </>
  );
}
