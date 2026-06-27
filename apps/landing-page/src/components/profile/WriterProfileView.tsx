import type { WriterProfile } from '@/lib/mock-writers';
import {
  CreditsStrip,
  MyLine,
  NowGrid,
  ProfileHero,
  ProfileSection,
  SeekingBetaAndRead,
} from '@/components/profile/primitives';
import {
  LibraryBlock,
  Memorables,
  OtherPlaces,
  ReadingCirclesBlock,
  SitWithAnyone,
  WishCards,
} from '@/components/profile/sections-shared';
import {
  BookPair,
  MyBetaCircleBlock,
  MyReaderBlock,
  MyWritingBlock,
  MyWritingLifeBlock,
  WritersWhoMadeMeBlock,
} from '@/components/profile/sections-writer';

/**
 * The full writer profile body (hero + sortable sections). Presentational and
 * shared between the gated in-app route (`/writer/[handle]`, where `editable` is
 * true on the viewer's own profile) and the public, decoupled `/write` showcase
 * (always read-only). Pass `editable={false}` for the public view so no Edit
 * affordances render.
 */
export function WriterProfileView({
  profile,
  editable,
}: {
  profile: WriterProfile;
  editable: boolean;
}) {
  return (
    <>
      <ProfileHero hero={profile.hero} editable={editable} />

      <NowGrid cards={profile.now} />

      <CreditsStrip items={profile.credits} />

      <SeekingBetaAndRead seeking={profile.seekingBeta} readMe={profile.readMeNow} />

      {profile.memorables.length > 0 ? (
        <ProfileSection title="The Memorables" editable={editable}>
          <Memorables items={profile.memorables} />
          {profile.myLine ? (
            <MyLine
              label={profile.myLine.label}
              text={profile.myLine.text}
              attribution={profile.myLine.attribution}
            />
          ) : null}
        </ProfileSection>
      ) : null}

      <ProfileSection title="My Writing" editable={editable}>
        <MyWritingBlock data={profile.myWriting} />
      </ProfileSection>

      <ProfileSection title="The Writers Who Made Me" editable={editable}>
        <WritersWhoMadeMeBlock data={profile.writersWhoMadeMe} />
      </ProfileSection>

      {profile.myReader.body ? (
        <ProfileSection title="My Reader" editable={editable}>
          <MyReaderBlock data={profile.myReader} />
        </ProfileSection>
      ) : null}

      {profile.myWritingLife.length > 0 ? (
        <ProfileSection title="My Writing Life" editable={editable}>
          <MyWritingLifeBlock items={profile.myWritingLife} />
        </ProfileSection>
      ) : null}

      {profile.myBetaCircle.active.title ? (
        <ProfileSection title="My Beta Circle" editable={editable}>
          <MyBetaCircleBlock data={profile.myBetaCircle} editable={editable} />
        </ProfileSection>
      ) : null}

      {profile.library.body ? (
        <ProfileSection title="What You'd Find in My Library" editable={editable}>
          <LibraryBlock body={profile.library.body} tbr={profile.library.tbr} />
        </ProfileSection>
      ) : null}

      {profile.last3Read.length > 0 || profile.allTimeFavourites.length > 0 ? (
        <ProfileSection title="Last Three Read & All-Time Favourites" editable={editable}>
          <BookPair last3={profile.last3Read} allTime={profile.allTimeFavourites} />
        </ProfileSection>
      ) : null}

      {profile.gotAway.length > 0 ? (
        <ProfileSection title="The Ones That Got Away" editable={editable}>
          <WishCards items={profile.gotAway} />
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

      <ProfileSection title="My Reading Circles" editable={editable}>
        <ReadingCirclesBlock
          open={profile.readingCircles.open}
          clubs={profile.readingCircles.clubs}
          editable={editable}
        />
      </ProfileSection>

      {profile.otherPlaces.length > 0 ? (
        <ProfileSection title="Other Places You Can Find Me" editable={editable}>
          <OtherPlaces links={profile.otherPlaces} />
        </ProfileSection>
      ) : null}
    </>
  );
}
