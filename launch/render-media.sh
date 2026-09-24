#!/usr/bin/env bash

set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
media_dir="$project_root/launch/media"
home_screenshot="$project_root/launch/screenshots/public/inicio-mobile-390x844.png"
rosary_screenshot="$project_root/launch/screenshots/public/rosario-mobile-390x844.png"
mission_screenshot="$project_root/launch/screenshots/public/missao-mobile-390x844.png"
privacy_screenshot="$project_root/launch/screenshots/public/privacidade-mobile-390x844.png"
background="$media_dir/campaign-background.png"
icon="$project_root/public/icon-v5-512.png"

find_font() {
  local family_pattern="$1"
  local candidate family

  for candidate in "$project_root"/.next/static/media/*-s.p.woff2; do
    [[ -f "$candidate" ]] || continue
    family="$(fc-scan --format '%{family}' "$candidate" 2>/dev/null | head -c 120)"
    if [[ "$family" == *"$family_pattern"* ]]; then
      printf '%s' "$candidate"
      return 0
    fi
  done

  return 1
}

serif_font="$(find_font 'Source Serif 4' || fc-match -f '%{file}' 'Liberation Serif')"
sans_font="$(find_font 'Source Sans 3' || fc-match -f '%{file}' 'Liberation Sans')"

for dependency in magick fc-scan; do
  command -v "$dependency" >/dev/null || {
    printf 'Missing dependency: %s\n' "$dependency" >&2
    exit 1
  }
done

for input in "$background" "$home_screenshot" "$rosary_screenshot" "$mission_screenshot" "$privacy_screenshot" "$icon"; do
  [[ -f "$input" ]] || {
    printf 'Missing input: %s\n' "$input" >&2
    exit 1
  }
done

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

make_caption() {
  local text="$1"
  local font="$2"
  local pointsize="$3"
  local color="$4"
  local width="$5"
  local height="$6"
  local output="$7"

  magick -background none -fill "$color" -font "$font" -pointsize "$pointsize" \
    -gravity northwest -size "${width}x${height}" caption:"$text" "$output"
}

make_phone() {
  local input="$1"
  local width="$2"
  local height="$3"
  local radius="$4"
  local output="$5"

  magick "$input" -resize "${width}x${height}^" -gravity north \
    -extent "${width}x${height}" \
    \( -size "${width}x${height}" xc:none -fill white \
       -draw "roundrectangle 0,0 $((width - 1)),$((height - 1)) ${radius},${radius}" \) \
    -alpha off -compose CopyOpacity -composite "$tmp_dir/phone-screen.png"

  magick -size "$((width + 16))x$((height + 16))" xc:none \
    -fill '#081410' -stroke '#c5a15a99' -strokewidth 2 \
    -draw "roundrectangle 1,1 $((width + 14)),$((height + 14)) $((radius + 7)),$((radius + 7))" \
    "$tmp_dir/phone-screen.png" -geometry +8+8 -composite "$output"
}

make_phone "$home_screenshot" 330 742 42 "$tmp_dir/phone-feed.png"
make_phone "$home_screenshot" 360 810 46 "$tmp_dir/phone-story.png"
make_phone "$rosary_screenshot" 330 742 42 "$tmp_dir/phone-rosary.png"
make_phone "$mission_screenshot" 330 742 42 "$tmp_dir/phone-mission.png"
make_phone "$privacy_screenshot" 330 742 42 "$tmp_dir/phone-privacy.png"

# Feed 4:5
magick "$background" -resize '1080x1350^' -gravity center -extent 1080x1350 \
  -fill '#07161266' -draw 'rectangle 0,0 1080,1350' "$tmp_dir/feed-base.png"
magick "$icon" -resize 84x84 "$tmp_dir/feed-icon.png"
make_caption 'EVANGELIZAE  •  BETA PÚBLICO' "$sans_font" 23 '#c5a15a' 500 55 "$tmp_dir/feed-kicker.png"
make_caption $'Oração católica,\nsem ruído.' "$serif_font" 82 '#f4efe6' 590 250 "$tmp_dir/feed-title.png"
make_caption $'Rosário guiado e oração sem distrações.\nGratuito, privado e sem conta.' "$sans_font" 31 '#e2dbce' 545 150 "$tmp_dir/feed-copy.png"
make_caption $'• sem anúncios\n• sem conta obrigatória\n• Rosário disponível offline' "$sans_font" 25 '#f4efe6' 500 170 "$tmp_dir/feed-points.png"
make_caption 'EXPERIMENTE O BETA  •  EVANGELIZAE.COM' "$sans_font" 22 '#f4efe6' 500 55 "$tmp_dir/feed-cta.png"

magick "$tmp_dir/feed-base.png" \
  "$tmp_dir/feed-icon.png" -geometry +70+64 -composite \
  "$tmp_dir/feed-kicker.png" -geometry +174+82 -composite \
  "$tmp_dir/feed-title.png" -geometry +70+230 -composite \
  "$tmp_dir/feed-copy.png" -geometry +70+520 -composite \
  "$tmp_dir/feed-points.png" -geometry +70+715 -composite \
  -fill '#8f2f45' -stroke '#b8566c' -strokewidth 1 -draw 'roundrectangle 66,1010 555,1082 36,36' \
  "$tmp_dir/feed-cta.png" -geometry +92+1034 -composite \
  "$tmp_dir/phone-feed.png" -geometry +680+405 -composite \
  -fill '#c5a15a' -font "$sans_font" -pointsize 18 -draw "text 70,1280 'VERITAS  •  COMMUNIO  •  MISSIO'" \
  -strip "$media_dir/evangelizae-beta-feed-1080x1350.png"

# Story 9:16
magick "$background" -resize '1080x1920^' -gravity center -extent 1080x1920 \
  -fill '#07161273' -draw 'rectangle 0,0 1080,1920' "$tmp_dir/story-base.png"
magick "$icon" -resize 100x100 "$tmp_dir/story-icon.png"
make_caption 'EVANGELIZAE  •  BETA PÚBLICO' "$sans_font" 25 '#c5a15a' 600 55 "$tmp_dir/story-kicker.png"
make_caption $'Um lugar simples\npara voltar a Deus\ntodos os dias.' "$serif_font" 78 '#f4efe6' 900 320 "$tmp_dir/story-title.png"
make_caption $'Rosário guiado. Progresso local.\nSem anúncios e sem conta.' "$sans_font" 31 '#e2dbce' 820 125 "$tmp_dir/story-copy.png"
make_caption 'CONHECER O BETA  •  EVANGELIZAE.COM' "$sans_font" 24 '#f4efe6' 600 60 "$tmp_dir/story-cta.png"

magick "$tmp_dir/story-base.png" \
  "$tmp_dir/story-icon.png" -geometry +80+170 -composite \
  "$tmp_dir/story-kicker.png" -geometry +202+202 -composite \
  "$tmp_dir/story-title.png" -geometry +80+340 -composite \
  "$tmp_dir/story-copy.png" -geometry +82+685 -composite \
  "$tmp_dir/phone-story.png" -geometry +360+860 -composite \
  -fill '#8f2f45' -stroke '#b8566c' -strokewidth 1 -draw 'roundrectangle 190,1710 890,1790 40,40' \
  "$tmp_dir/story-cta.png" -geometry +285+1736 -composite \
  -strip "$media_dir/evangelizae-beta-story-1080x1920.png"

# Square sharing card
magick "$background" -resize '1200x1200^' -gravity center -extent 1200x1200 \
  -fill '#07161266' -draw 'rectangle 0,0 1200,1200' "$tmp_dir/square-base.png"
magick "$icon" -resize 96x96 "$tmp_dir/square-icon.png"
make_caption 'EVANGELIZAE  •  BETA PÚBLICO' "$sans_font" 24 '#c5a15a' 600 55 "$tmp_dir/square-kicker.png"
make_caption $'Um lugar simples\npara voltar a Deus\ntodos os dias.' "$serif_font" 62 '#f4efe6' 650 410 "$tmp_dir/square-title.png"
make_caption $'Rosário guiado em uma experiência\ngratuita, privada e sem anúncios.' "$sans_font" 29 '#e2dbce' 600 130 "$tmp_dir/square-copy.png"
make_caption 'REZE, TESTE E AJUDE A MELHORAR.' "$sans_font" 23 '#f4efe6' 580 60 "$tmp_dir/square-cta.png"

magick "$tmp_dir/square-base.png" \
  "$tmp_dir/square-icon.png" -geometry +72+68 -composite \
  "$tmp_dir/square-kicker.png" -geometry +190+96 -composite \
  "$tmp_dir/square-title.png" -geometry +72+250 -composite \
  "$tmp_dir/square-copy.png" -geometry +74+635 -composite \
  -fill '#8f2f45' -stroke '#b8566c' -strokewidth 1 -draw 'roundrectangle 70,890 650,966 38,38' \
  "$tmp_dir/square-cta.png" -geometry +105+914 -composite \
  \( "$tmp_dir/phone-feed.png" -resize 310x697 \) -geometry +805+330 -composite \
  -strip "$media_dir/evangelizae-beta-square-1200x1200.png"

# Open Graph / press preview
magick "$background" -resize '1200x630^' -gravity center -extent 1200x630 \
  -fill '#07161270' -draw 'rectangle 0,0 1200,630' "$tmp_dir/og-base.png"
magick "$icon" -resize 210x210 "$tmp_dir/og-icon.png"
make_caption 'EVANGELIZAE  •  BETA PÚBLICO' "$sans_font" 23 '#c5a15a' 660 50 "$tmp_dir/og-kicker.png"
make_caption $'Oração católica,\nsem ruído.' "$serif_font" 75 '#f4efe6' 690 220 "$tmp_dir/og-title.png"
make_caption 'Rosário guiado. Gratuito, privado e sem anúncios.' "$sans_font" 27 '#e2dbce' 690 100 "$tmp_dir/og-copy.png"

magick "$tmp_dir/og-base.png" \
  "$tmp_dir/og-kicker.png" -geometry +70+78 -composite \
  "$tmp_dir/og-title.png" -geometry +70+155 -composite \
  "$tmp_dir/og-copy.png" -geometry +73+425 -composite \
  "$tmp_dir/og-icon.png" -geometry +900+210 -composite \
  -strip "$media_dir/evangelizae-beta-og-1200x630.png"

# Carousel 4:5 — slide 1 reuses the main launch composition.
magick "$media_dir/evangelizae-beta-feed-1080x1350.png" \
  -strip "$media_dir/evangelizae-carousel-01-convite-1080x1350.png"

# Carousel slide 2 — Rosary.
magick "$background" -resize '1080x1350^' -gravity center -extent 1080x1350 \
  -fill '#07161270' -draw 'rectangle 0,0 1080,1350' "$tmp_dir/carousel-rosary-base.png"
make_caption '02  •  ROSÁRIO GUIADO' "$sans_font" 23 '#c5a15a' 520 55 "$tmp_dir/carousel-rosary-kicker.png"
make_caption $'Reze no ritmo\ndo silêncio.' "$serif_font" 78 '#f4efe6' 570 245 "$tmp_dir/carousel-rosary-title.png"
make_caption $'Rosário completo em 73 passos,\nmistérios do dia e retomada automática.' "$sans_font" 30 '#e2dbce' 560 150 "$tmp_dir/carousel-rosary-copy.png"
make_caption $'• escolha os mistérios\n• avance sem perder o foco\n• retome quando precisar' "$sans_font" 25 '#f4efe6' 520 175 "$tmp_dir/carousel-rosary-points.png"
make_caption 'ESCOLHA OS MISTÉRIOS. REZE COM CALMA.' "$sans_font" 21 '#f4efe6' 520 55 "$tmp_dir/carousel-rosary-cta.png"
magick "$tmp_dir/carousel-rosary-base.png" \
  "$tmp_dir/feed-icon.png" -geometry +70+64 -composite \
  "$tmp_dir/carousel-rosary-kicker.png" -geometry +174+82 -composite \
  "$tmp_dir/carousel-rosary-title.png" -geometry +70+235 -composite \
  "$tmp_dir/carousel-rosary-copy.png" -geometry +70+520 -composite \
  "$tmp_dir/carousel-rosary-points.png" -geometry +70+720 -composite \
  -fill '#8f2f45' -stroke '#b8566c' -strokewidth 1 -draw 'roundrectangle 66,1035 605,1107 36,36' \
  "$tmp_dir/carousel-rosary-cta.png" -geometry +92+1059 -composite \
  "$tmp_dir/phone-rosary.png" -geometry +680+390 -composite \
  -fill '#c5a15a' -font "$sans_font" -pointsize 18 -draw "text 70,1280 'EVANGELIZAE.COM'" \
  -strip "$media_dir/evangelizae-carousel-02-rosario-1080x1350.png"

# Carousel slide 3 — Privacy.
magick "$background" -resize '1080x1350^' -gravity center -extent 1080x1350 \
  -fill '#07161270' -draw 'rectangle 0,0 1080,1350' "$tmp_dir/carousel-privacy-base.png"
make_caption '03  •  PRIVACIDADE' "$sans_font" 23 '#c5a15a' 520 55 "$tmp_dir/carousel-privacy-kicker.png"
make_caption $'Sua oração não é\nmatéria-prima.' "$serif_font" 72 '#f4efe6' 590 250 "$tmp_dir/carousel-privacy-title.png"
make_caption $'Nome, intenções, andamento e histórico\nficam guardados neste dispositivo.' "$sans_font" 29 '#e2dbce' 570 145 "$tmp_dir/carousel-privacy-copy.png"
make_caption $'• sem conta obrigatória\n• sem anúncios\n• exportação e exclusão total' "$sans_font" 25 '#f4efe6' 520 175 "$tmp_dir/carousel-privacy-points.png"
make_caption 'PRIVACIDADE DESDE O PRIMEIRO DIA.' "$sans_font" 21 '#f4efe6' 500 55 "$tmp_dir/carousel-privacy-cta.png"
magick "$tmp_dir/carousel-privacy-base.png" \
  "$tmp_dir/feed-icon.png" -geometry +70+64 -composite \
  "$tmp_dir/carousel-privacy-kicker.png" -geometry +174+82 -composite \
  "$tmp_dir/carousel-privacy-title.png" -geometry +70+235 -composite \
  "$tmp_dir/carousel-privacy-copy.png" -geometry +70+520 -composite \
  "$tmp_dir/carousel-privacy-points.png" -geometry +70+720 -composite \
  -fill '#8f2f45' -stroke '#b8566c' -strokewidth 1 -draw 'roundrectangle 66,1035 560,1107 36,36' \
  "$tmp_dir/carousel-privacy-cta.png" -geometry +92+1059 -composite \
  "$tmp_dir/phone-privacy.png" -geometry +680+390 -composite \
  -fill '#c5a15a' -font "$sans_font" -pointsize 18 -draw "text 70,1280 'EVANGELIZAE.COM'" \
  -strip "$media_dir/evangelizae-carousel-03-privacidade-1080x1350.png"

# Carousel slide 4 — Mission.
magick "$background" -resize '1080x1350^' -gravity center -extent 1080x1350 \
  -fill '#07161270' -draw 'rectangle 0,0 1080,1350' "$tmp_dir/carousel-mission-base.png"
make_caption '04  •  A MISSÃO' "$sans_font" 23 '#c5a15a' 520 55 "$tmp_dir/carousel-mission-kicker.png"
make_caption $'Feito para sair\nde cena.' "$serif_font" 78 '#f4efe6' 570 245 "$tmp_dir/carousel-mission-title.png"
make_caption $'A tecnologia ajuda a entrar em oração\ne depois devolve você à vida concreta.' "$sans_font" 29 '#e2dbce' 570 145 "$tmp_dir/carousel-mission-copy.png"
make_caption $'Veritas  •  Communio  •  Missio\nFamília  •  Paróquia  •  Sacramentos' "$sans_font" 25 '#f4efe6' 560 135 "$tmp_dir/carousel-mission-points.png"
make_caption 'A FÉ CONTINUA FORA DA TELA.' "$sans_font" 21 '#f4efe6' 450 55 "$tmp_dir/carousel-mission-cta.png"
magick "$tmp_dir/carousel-mission-base.png" \
  "$tmp_dir/feed-icon.png" -geometry +70+64 -composite \
  "$tmp_dir/carousel-mission-kicker.png" -geometry +174+82 -composite \
  "$tmp_dir/carousel-mission-title.png" -geometry +70+235 -composite \
  "$tmp_dir/carousel-mission-copy.png" -geometry +70+520 -composite \
  "$tmp_dir/carousel-mission-points.png" -geometry +70+720 -composite \
  -fill '#8f2f45' -stroke '#b8566c' -strokewidth 1 -draw 'roundrectangle 66,1035 500,1107 36,36' \
  "$tmp_dir/carousel-mission-cta.png" -geometry +92+1059 -composite \
  "$tmp_dir/phone-mission.png" -geometry +680+390 -composite \
  -fill '#c5a15a' -font "$sans_font" -pointsize 18 -draw "text 70,1280 'EVANGELIZAE.COM'" \
  -strip "$media_dir/evangelizae-carousel-04-missao-1080x1350.png"

# Carousel slide 5 — invitation to the beta.
magick "$background" -resize '1080x1350^' -gravity center -extent 1080x1350 \
  -fill '#07161266' -draw 'rectangle 0,0 1080,1350' "$tmp_dir/carousel-final-base.png"
magick "$icon" -resize 150x150 "$tmp_dir/carousel-final-icon.png"
make_caption '05  •  BETA PÚBLICO' "$sans_font" 25 '#c5a15a' 600 55 "$tmp_dir/carousel-final-kicker.png"
make_caption $'Agora precisamos\nde quem reza.' "$serif_font" 92 '#f4efe6' 900 300 "$tmp_dir/carousel-final-title.png"
make_caption $'Conheça o beta. Reze com calma e conte\nonde a experiência ajuda ou distrai.' "$sans_font" 34 '#e2dbce' 820 155 "$tmp_dir/carousel-final-copy.png"
make_caption 'EVANGELIZAE.COM' "$sans_font" 31 '#f4efe6' 500 70 "$tmp_dir/carousel-final-cta.png"
magick "$tmp_dir/carousel-final-base.png" \
  "$tmp_dir/carousel-final-icon.png" -geometry +70+76 -composite \
  "$tmp_dir/carousel-final-kicker.png" -geometry +250+125 -composite \
  "$tmp_dir/carousel-final-title.png" -geometry +70+365 -composite \
  "$tmp_dir/carousel-final-copy.png" -geometry +75+735 -composite \
  -fill '#8f2f45' -stroke '#b8566c' -strokewidth 1 -draw 'roundrectangle 70,1010 650,1102 46,46' \
  "$tmp_dir/carousel-final-cta.png" -geometry +115+1040 -composite \
  -fill '#c5a15a' -font "$sans_font" -pointsize 18 -draw "text 70,1280 'VERITAS  •  COMMUNIO  •  MISSIO'" \
  -strip "$media_dir/evangelizae-carousel-05-beta-1080x1350.png"

identify "$media_dir"/evangelizae-beta-*.png
identify "$media_dir"/evangelizae-carousel-*.png
