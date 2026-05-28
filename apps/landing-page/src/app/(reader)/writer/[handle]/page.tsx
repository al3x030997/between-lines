import { notFound } from 'next/navigation';
import { getWriterProfile } from '@/lib/mock-writers';
import {
  CreditsStrip,
  MyLine,
  NowGrid,
  NumberedBookList,
  ProfileHero,
  ProfileSection,
  SeekingBetaAndRead,
  TagList,
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
import { OwnProfileGate } from '@/components/profile/OwnProfileGate';

type PageProps = { params: { handle: string } };

export default function WriterProfilePage({ params }: PageProps) {
  const profile = getWriterProfile(params.handle);
  if (!profile) notFound();

  return (
    <main className="br-pf-page">
      <OwnProfileGate ownHandle={profile.handle}>
        {(editable) => (
          <>
            <ProfileHero hero={profile.hero} editable={editable} />

            <NowGrid cards={profile.now} />

            <CreditsStrip items={profile.credits} />

            <SeekingBetaAndRead seeking={profile.seekingBeta} readMe={profile.readMeNow} />

            {profile.memorables.length > 0 ? (
              <ProfileSection title="The Memorables" editable={editable}>
                <Memorables items={profile.memorables} />
                {profile.myLine ? (
                  <MyLine label={profile.myLine.label} text={profile.myLine.text} attribution={profile.myLine.attribution} />
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
              <ReadingCirclesBlock open={profile.readingCircles.open} clubs={profile.readingCircles.clubs} editable={editable} />
            </ProfileSection>

            {profile.otherPlaces.length > 0 ? (
              <ProfileSection title="Other Places You Can Find Me" editable={editable}>
                <OtherPlaces links={profile.otherPlaces} />
              </ProfileSection>
            ) : null}
          </>
        )}
      </OwnProfileGate>
    </main>
  );
}

// Suppress unused-import lint warnings on dependent helpers
void NumberedBookList;
void TagList;
