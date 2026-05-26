import React, {useMemo, useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {images} from '../assets';
import {PrimaryButton} from '../components/PrimaryButton';
import {Screen} from '../components/Screen';
import {trailById, trails} from '../data/trails';
import {useGallery} from '../storage/GalleryContext';
import {colors, clamp} from '../theme';
import type {GalleryEntry} from '../types/app';
import {shareText} from '../utils/share';

type FieldKey = 'name' | 'location' | 'date';

const fieldLabels: Record<FieldKey, string> = {
  name: 'Name',
  location: 'Location',
  date: 'Date',
};

const fieldPlaceholders: Record<FieldKey, string> = {
  name: 'Type Here...',
  location: 'Type Here...',
  date: 'Type Here...',
};

function defaultDate(): string {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function GalleryScreen(): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const {entries, hydrated, addEntry, removeEntry} = useGallery();
  const compact = height < 720 || width < 380;
  const bottomExtra = compact ? 150 : 100;
  const [mode, setMode] = useState<'home' | 'form' | 'detail'>('home');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<FieldKey>('name');
  const [draft, setDraft] = useState({
    name: '',
    location: '',
    date: defaultDate(),
    imageUri: '',
  });
  const selectedEntry = entries.find(entry => entry.id === selectedId) ?? null;
  const formImageHeight = clamp(width * (compact ? 0.34 : 0.46), 122, 230);
  const entryImageHeight = clamp(width * (compact ? 0.34 : 0.4), 118, 150);
  const canSave =
    draft.name.trim().length > 0 &&
    draft.location.trim().length > 0 &&
    draft.date.trim().length > 0 &&
    draft.imageUri.trim().length > 0;

  const firstEntry = useMemo(() => entries[0], [entries]);

  function openForm() {
    setDraft({name: '', location: '', date: defaultDate(), imageUri: ''});
    setActiveField('name');
    setMode('form');
  }

  async function pickPhoto() {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.9,
      includeBase64: false,
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      Alert.alert('Gallery', result.errorMessage ?? 'Photo selection failed.');
      return;
    }

    const uri = result.assets?.[0]?.uri;

    if (uri) {
      setDraft(value => ({...value, imageUri: uri}));
    }
  }

  async function saveDraft() {
    if (!canSave) {
      return;
    }

    await addEntry({
      name: draft.name.trim(),
      location: draft.location.trim(),
      date: draft.date.trim(),
      imageTrailId: trails[0].id,
      imageUri: draft.imageUri.trim(),
    });
    setMode('home');
  }

  function applyKey(key: string) {
    setDraft(value => ({
      ...value,
      [activeField]: `${value[activeField]}${key}`,
    }));
  }

  function backspace() {
    setDraft(value => ({
      ...value,
      [activeField]: value[activeField].slice(0, -1),
    }));
  }

  function clearField() {
    setDraft(value => ({...value, [activeField]: ''}));
  }

  function openDetail(entry: GalleryEntry) {
    setSelectedId(entry.id);
    setMode('detail');
  }

  if (mode === 'form') {
    return (
      <Screen bottomExtra={bottomExtra} contentStyle={styles.formContent}>
        <GalleryHeader compact={compact} onAdd={openForm} />

        <Pressable
          accessibilityRole="button"
          onPress={pickPhoto}
          style={[
            styles.photoPicker,
            {height: formImageHeight},
            compact && styles.photoPickerCompact,
          ]}>
          {draft.imageUri ? (
            <Image
              source={{uri: draft.imageUri}}
              resizeMode="cover"
              style={styles.pickedPhoto}
            />
          ) : (
            <Text style={[styles.placeholderIcon, compact && styles.placeholderIconCompact]}>
              📷
            </Text>
          )}
          <Pressable
            accessibilityRole="button"
            onPress={pickPhoto}
            style={styles.photoPlus}>
            <Text style={styles.plusText}>+</Text>
          </Pressable>
        </Pressable>

        <View style={[styles.fields, compact && styles.fieldsCompact]}>
          {(Object.keys(fieldLabels) as FieldKey[]).map(field => (
            <View key={field} style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>{fieldLabels[field]}:</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => setActiveField(field)}
                style={[
                  styles.fieldValue,
                  compact && styles.fieldValueCompact,
                  activeField === field && styles.fieldValueActive,
                ]}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.fieldText,
                    !draft[field] && styles.fieldPlaceholder,
                  ]}>
                  {draft[field] || fieldPlaceholders[field]}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>

        <PrimaryButton
          label="SAVE"
          disabled={!canSave}
          onPress={saveDraft}
          style={[styles.saveButton, compact && styles.saveButtonCompact]}
        />

        <CustomKeyboard
          activeLabel={fieldLabels[activeField]}
          compact={compact}
          onKey={applyKey}
          onSpace={() => applyKey(' ')}
          onBackspace={backspace}
          onClear={clearField}
        />
      </Screen>
    );
  }

  if (mode === 'detail' && selectedEntry) {
    const trail = trailById[selectedEntry.imageTrailId] ?? trails[0];
    const imageSource = selectedEntry.imageUri
      ? {uri: selectedEntry.imageUri}
      : trail.image;

    return (
      <Screen bottomExtra={bottomExtra}>
        <GalleryHeader compact={compact} onAdd={openForm} />

        <View style={[styles.detailCard, compact && styles.detailCardCompact]}>
          <Image source={imageSource} resizeMode="cover" style={styles.detailImage} />
          <View style={styles.detailTopActions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setMode('home')}
              style={styles.smallAction}>
              <Text style={styles.smallActionText}>←</Text>
            </Pressable>
            <View style={styles.detailRightActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  shareText(
                    selectedEntry.name,
                    `${selectedEntry.name}\n${selectedEntry.location}\n${selectedEntry.date}`,
                  )
                }
                style={styles.smallAction}>
                <Text style={styles.smallActionText}>↗</Text>
              </Pressable>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              removeEntry(selectedEntry.id);
              setMode('home');
            }}
            style={styles.deleteOnImage}>
            <Text style={styles.deleteText}>▢</Text>
          </Pressable>
        </View>

        <GalleryValue compact={compact} value={selectedEntry.name} />
        <GalleryValue compact={compact} value={selectedEntry.location} />
        <GalleryValue compact={compact} value={selectedEntry.date} />
      </Screen>
    );
  }

  return (
    <Screen bottomExtra={bottomExtra}>
      <GalleryHeader compact={compact} onAdd={openForm} />

      {entries.length === 0 ? (
        <View style={[styles.empty, compact && styles.emptyCompact]}>
          <Text style={[styles.emptyTitle, compact && styles.emptyTitleCompact]}>
            {hydrated ? 'No added photos yet' : 'Loading photos'}
          </Text>
          <Text style={[styles.emptyText, compact && styles.emptyTextCompact]}>
            No photos added yet. Start building your canyoning memories by
            uploading your first adventure shot.
          </Text>
          <Image
            source={images.guideCamera}
            resizeMode="contain"
            style={[styles.emptyGuide, compact && styles.emptyGuideCompact]}
          />
          <Pressable
            accessibilityRole="button"
            onPress={openForm}
            style={[styles.uploadCard, compact && styles.uploadCardCompact]}>
            <View style={[styles.uploadIcon, compact && styles.uploadIconCompact]}>
              <Text style={styles.uploadIconText}>▧</Text>
            </View>
            <View style={styles.uploadTextWrap}>
              <Text style={styles.uploadTitle}>Upload Canyon Photos</Text>
              <Text style={styles.uploadText}>
                Share your expedition memories from Niagara canyons
              </Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <View style={[styles.entries, compact && styles.entriesCompact]}>
          {entries.map(entry => {
            const trail = trailById[entry.imageTrailId] ?? trails[0];
            const imageSource = entry.imageUri
              ? {uri: entry.imageUri}
              : trail.image;

            return (
              <View key={entry.id} style={styles.entryCard}>
                <Image
                  source={imageSource}
                  resizeMode="cover"
                  style={[styles.entryImage, {height: entryImageHeight}]}
                />
                <View style={styles.entryActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      shareText(entry.name, `${entry.location}\n${entry.date}`)
                    }
                    style={styles.smallAction}>
                    <Text style={styles.smallActionText}>↗</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => removeEntry(entry.id)}
                    style={[styles.smallAction, styles.deleteAction]}>
                    <Text style={styles.deleteText}>▢</Text>
                  </Pressable>
                </View>
                <View style={[styles.entryBody, compact && styles.entryBodyCompact]}>
                  <View>
                    <Text numberOfLines={1} style={styles.entryName}>
                      {entry.name}
                    </Text>
                    <Text numberOfLines={1} style={styles.entryLocation}>
                      {entry.location}
                    </Text>
                    <Text style={styles.entryDate}>{entry.date}</Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => openDetail(entry)}
                    style={styles.entryOpen}>
                    <Text style={styles.entryOpenText}>Open ›</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {firstEntry && <View style={styles.bottomSpacer} />}
    </Screen>
  );
}

function GalleryHeader({
  compact,
  onAdd,
}: {
  compact: boolean;
  onAdd: () => void;
}) {
  return (
    <View style={[styles.header, compact && styles.headerCompact]}>
      <View>
        <Text style={styles.kicker}>MY PHOTOS</Text>
        <Text style={styles.title}>Gallery</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onAdd}
        style={[styles.addButton, compact && styles.addButtonCompact]}>
        <Text style={styles.addText}>+</Text>
      </Pressable>
    </View>
  );
}

function GalleryValue({compact, value}: {compact: boolean; value: string}) {
  return (
    <View style={[styles.galleryValue, compact && styles.galleryValueCompact]}>
      <Text numberOfLines={1} style={styles.galleryValueText}>
        {value}
      </Text>
    </View>
  );
}

function CustomKeyboard({
  activeLabel,
  compact,
  onKey,
  onSpace,
  onBackspace,
  onClear,
}: {
  activeLabel: string;
  compact: boolean;
  onKey: (key: string) => void;
  onSpace: () => void;
  onBackspace: () => void;
  onClear: () => void;
}) {
  const rows = ['1234567890', 'QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

  return (
    <View style={[styles.keyboard, compact && styles.keyboardCompact]}>
      <View style={styles.keyboardHeader}>
        <Text style={styles.keyboardTitle}>Keyboard: {activeLabel}</Text>
        <Pressable accessibilityRole="button" onPress={onClear} style={styles.clearKey}>
          <Text style={styles.clearKeyText}>Clear</Text>
        </Pressable>
      </View>
      {rows.map(row => (
        <View key={row} style={styles.keyRow}>
          {row.split('').map(key => (
            <Pressable
              key={key}
              accessibilityRole="button"
              onPress={() => onKey(key)}
              style={[styles.key, compact && styles.keyCompact]}>
              <Text style={styles.keyText}>{key}</Text>
            </Pressable>
          ))}
        </View>
      ))}
      <View style={styles.keyRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onKey('.')}
          style={[styles.wideKey, compact && styles.wideKeyCompact]}>
          <Text style={styles.keyText}>.</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onSpace}
          style={[styles.spaceKey, compact && styles.wideKeyCompact]}>
          <Text style={styles.keyText}>Space</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onBackspace}
          style={[styles.wideKey, compact && styles.wideKeyCompact]}>
          <Text style={styles.keyText}>⌫</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 58,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerCompact: {
    minHeight: 50,
    marginBottom: 12,
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2.2,
  },
  title: {
    color: colors.sand,
    fontSize: 28,
    lineHeight: 33,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 8,
  },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonCompact: {
    width: 34,
    height: 34,
    borderRadius: 10,
  },
  addText: {
    color: colors.deepForest,
    fontSize: 24,
    fontWeight: '900',
  },
  empty: {
    minHeight: 610,
    alignItems: 'center',
  },
  emptyCompact: {
    minHeight: 500,
  },
  emptyTitle: {
    color: colors.sand,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 8,
    letterSpacing: 0,
  },
  emptyTitleCompact: {
    fontSize: 18,
    marginTop: 4,
  },
  emptyText: {
    color: colors.stone,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 22,
  },
  emptyTextCompact: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
    paddingHorizontal: 18,
  },
  emptyGuide: {
    width: 190,
    height: 340,
    marginTop: 12,
  },
  emptyGuideCompact: {
    width: 150,
    height: 250,
    marginTop: 6,
  },
  uploadCard: {
    width: '100%',
    minHeight: 92,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  uploadCardCompact: {
    minHeight: 78,
    gap: 10,
    padding: 12,
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconCompact: {
    width: 42,
    height: 42,
    borderRadius: 10,
  },
  uploadIconText: {
    color: colors.gold,
    fontSize: 22,
  },
  uploadTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  uploadTitle: {
    color: colors.sand,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
  },
  uploadText: {
    color: colors.stone,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  formContent: {
  },
  photoPicker: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },
  photoPickerCompact: {
    marginBottom: 10,
  },
  pickedPhoto: {
    width: '100%',
    height: '100%',
  },
  placeholderIcon: {
    color: colors.gold,
    fontSize: 76,
    opacity: 0.88,
  },
  placeholderIconCompact: {
    fontSize: 58,
  },
  photoPlus: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    color: colors.deepForest,
    fontSize: 22,
    fontWeight: '900',
  },
  fields: {
    gap: 10,
    marginBottom: 14,
  },
  fieldsCompact: {
    gap: 8,
    marginBottom: 10,
  },
  fieldBlock: {
    gap: 7,
  },
  fieldLabel: {
    color: colors.sand,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  fieldValue: {
    minHeight: 52,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: colors.panel,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  fieldValueCompact: {
    minHeight: 46,
    paddingHorizontal: 14,
  },
  fieldValueActive: {
    borderColor: colors.gold,
    backgroundColor: colors.mossSoft,
  },
  fieldText: {
    color: colors.sand,
    fontSize: 15,
    fontWeight: '700',
  },
  fieldPlaceholder: {
    color: colors.stone,
    fontStyle: 'italic',
  },
  saveButton: {
    width: 160,
    alignSelf: 'center',
    marginBottom: 14,
  },
  saveButtonCompact: {
    minHeight: 44,
    marginBottom: 10,
  },
  keyboard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: 10,
    gap: 7,
  },
  keyboardCompact: {
    padding: 8,
    gap: 5,
  },
  keyboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  keyboardTitle: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  clearKey: {
    minHeight: 26,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  clearKeyText: {
    color: colors.stone,
    fontSize: 11,
    fontWeight: '900',
  },
  keyRow: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
  },
  key: {
    flex: 1,
    minHeight: 31,
    maxWidth: 32,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.panelStrong,
    borderWidth: 1,
    borderColor: 'rgba(212,170,46,0.16)',
  },
  keyCompact: {
    minHeight: 28,
    maxWidth: 30,
  },
  wideKey: {
    flex: 1,
    minHeight: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.panelStrong,
    borderWidth: 1,
    borderColor: 'rgba(212,170,46,0.16)',
  },
  wideKeyCompact: {
    minHeight: 30,
  },
  spaceKey: {
    flex: 3,
    minHeight: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.panelStrong,
    borderWidth: 1,
    borderColor: 'rgba(212,170,46,0.16)',
  },
  keyText: {
    color: colors.sand,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  entries: {
    gap: 14,
  },
  entriesCompact: {
    gap: 10,
  },
  entryCard: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  entryImage: {
    height: 150,
    width: '100%',
    backgroundColor: colors.moss,
  },
  entryActions: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 8,
  },
  smallAction: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(6,40,24,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailRightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  smallActionText: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: '900',
  },
  deleteAction: {
    borderColor: 'rgba(157,38,33,0.46)',
  },
  deleteText: {
    color: colors.red,
    fontSize: 15,
    fontWeight: '900',
  },
  entryBody: {
    minHeight: 110,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  entryBodyCompact: {
    minHeight: 88,
    padding: 12,
    gap: 8,
  },
  entryName: {
    color: colors.sand,
    fontSize: 17,
    fontWeight: '900',
  },
  entryLocation: {
    color: colors.sand,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 8,
  },
  entryDate: {
    color: colors.mint,
    fontSize: 12,
    marginTop: 8,
  },
  entryOpen: {
    minWidth: 82,
    minHeight: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryOpenText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '900',
  },
  detailCard: {
    height: 285,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    marginBottom: 14,
  },
  detailCardCompact: {
    height: 230,
    marginBottom: 10,
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  detailTopActions: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteOnImage: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(6,40,24,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(157,38,33,0.46)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryValue: {
    minHeight: 52,
    borderRadius: 13,
    backgroundColor: colors.panel,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  galleryValueCompact: {
    minHeight: 46,
    marginBottom: 9,
  },
  galleryValueText: {
    color: colors.sand,
    fontSize: 15,
    fontWeight: '800',
  },
  bottomSpacer: {
    height: 1,
  },
});
