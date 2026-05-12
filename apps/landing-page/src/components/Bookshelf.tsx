'use client';
import { useState } from 'react';
import { getBooks, type Book, type Palette } from '@/lib/palettes';

function BookSpine({ book, shelfBottom, P }: { book: Book; shelfBottom: number; P: Palette }) {
  const [hov, setHov] = useState(false);
  const y = shelfBottom - book.h;
  const lift = hov ? 'translateY(-12px)' : 'none';
  const origin = `${book.w / 2}px ${shelfBottom}px`;
  const trans = { transition: 'transform .3s ease', transform: lift, transformOrigin: origin } as const;
  return (
    <g style={{ cursor: 'pointer' }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <rect
        x={0} y={y} width={book.w} height={book.h} fill={book.bg}
        stroke={book.stroke || 'none'} strokeWidth={book.stroke ? 1 : 0} rx={1}
        style={trans}
      />
      {book.accent && (
        <rect x={0} y={y + (book.accentY || 0)} width={book.w} height={book.accentH || 2} fill={book.accent} opacity={0.7} style={trans} />
      )}
      {book.lines && (
        <g style={trans}>
          {[0, 8, 16].map(dy => (
            <rect key={dy} x={6} y={y + 30 + dy} width={book.w - 12} height={3} fill={P.primary} />
          ))}
        </g>
      )}
      <g style={trans}>
        <g transform={`translate(${book.w / 2},${y + book.h / 2}) rotate(-90)`}>
          <text
            x={0} y={6} textAnchor="middle"
            fontFamily="'Cormorant Garamond',Georgia,serif"
            fontSize={book.w > 40 ? 18 : book.w > 25 ? 12 : 10}
            fill={book.text} letterSpacing={2} fontWeight={500}
          >
            {book.title}
          </text>
        </g>
        {book.author && (
          <g transform={`translate(${book.w / 2},${y + book.h - 30}) rotate(-90)`}>
            <text x={0} y={3} textAnchor="middle" fontFamily="'Outfit',sans-serif" fontSize={7} fill={book.text} letterSpacing={1.5} opacity={0.7}>
              {book.author}
            </text>
          </g>
        )}
        {book.genre && (
          <g transform={`translate(${book.w / 2},${y + 60}) rotate(-90)`}>
            <text x={0} y={3} textAnchor="middle" fontFamily="'Outfit',sans-serif" fontSize={7} fill={P.accent} letterSpacing={2}>
              {book.genre}
            </text>
          </g>
        )}
        {book.hasSlots && <circle cx={book.w / 2} cy={y + book.h - 15} r={3} fill={P.amber} />}
      </g>
    </g>
  );
}

export function Bookshelf({ P }: { P: Palette }) {
  const shelfY = 520;
  const books = getBooks(P);
  let x = 0;
  return (
    <svg viewBox="0 0 380 650" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="xMidYMax meet">
      <text x={10} y={30} fontFamily="'Outfit',sans-serif" fontSize={9} letterSpacing={2.5} fill={P.mute} fontWeight={600}>
        ON THE SHELF — THIS WEEK
      </text>
      <g transform="translate(10,0)">
        {books.map((book, i) => {
          const xPos = x;
          x += book.w;
          return (
            <g key={i} transform={`translate(${xPos},0)`}>
              <BookSpine book={book} shelfBottom={shelfY} P={P} />
            </g>
          );
        })}
      </g>
      <rect x={0} y={shelfY} width={380} height={3} fill={P.shelfWood} />
      <rect x={0} y={shelfY + 3} width={380} height={8} fill={P.shelfTrim} />
      <rect x={0} y={shelfY + 11} width={380} height={2} fill={P.primary} opacity={0.3} />
      <text x={10} y={shelfY + 38} fontFamily="'Outfit',sans-serif" fontSize={12} fill={P.mute} fontStyle="italic">
        47 manuscripts on the shelf this week.
      </text>
      <text x={10} y={shelfY + 56} fontFamily="'Outfit',sans-serif" fontSize={12} fill={P.mute} fontStyle="italic">
        Tap a spine to start reading.
      </text>
      <circle cx={13} cy={shelfY + 78} r={3} fill={P.amber} />
      <text x={22} y={shelfY + 81} fontFamily="'Outfit',sans-serif" fontSize={9} letterSpacing={1} fill={P.amber}>
        limited slots remaining
      </text>
    </svg>
  );
}
