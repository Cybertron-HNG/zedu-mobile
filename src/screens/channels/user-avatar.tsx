import React, { useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeProvider';
import { createChannelSetupStyles } from '@/theme/createStep10Styles';
import { AppText } from '@/components/ui/text';
import { normalize } from '@/utils/normalize';

// Minimum touch target recommended for tappable elements.
const MIN_TOUCH_TARGET = 44;

interface UserAvatarProps {
  user: {
    avatar_url?: string;
    default_avatar_url?: string;
    online?: boolean;
    username?: string;
    first_name?: string;
    email?: string;
  };
  size?: number;
  showBadge?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * Circular avatar for the current user. Falls back to the user's initial when
 * there is no image or it fails to load, and keeps a tap area of at least 44pt.
 * Opens the Profile screen when pressed unless `onPress` is provided.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 40,
  showBadge = true,
  onPress,
  style,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(
    () => createChannelSetupStyles(colors).userAvatar,
    [colors],
  );
  const navigation = useNavigation<any>();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('SettingStack', { screen: 'Profile' });
    }
  };

  const avatarUri = user?.avatar_url || user?.default_avatar_url;
  const avatarSource = useMemo(() => ({ uri: avatarUri }), [avatarUri]);

  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    setImageFailed(false);
  }, [avatarUri]);

  const showImage = !!avatarUri && !imageFailed;
  const initial = Array.from(
    user?.username || user?.first_name || user?.email || '?',
  )[0].toUpperCase();

  const avatarSize = normalize(size);
  const slop = Math.max(0, Math.ceil((MIN_TOUCH_TARGET - avatarSize) / 2));
  const hitSlop = { top: slop, bottom: slop, left: slop, right: slop };

  const dynamicStyles = {
    // hitSlop can't reach past the parent's bounds on Android, so reserve the
    // same space as margin to keep the full 44pt target tappable.
    container: {
      width: avatarSize,
      height: avatarSize,
      margin: slop,
    },
    image: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
    },
    badge: {
      width: normalize(size * 0.3),
      height: normalize(size * 0.3),
      borderRadius: normalize((size * 0.3) / 2),
      backgroundColor: user?.online ? colors.online : colors.offline,
    },
  };

  return (
    <TouchableOpacity
      style={[styles.avatarContainer, dynamicStyles.container, style]}
      onPress={handlePress}
      activeOpacity={0.8}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel="Open profile"
    >
      {showImage ? (
        <FastImage
          source={avatarSource}
          style={dynamicStyles.image}
          resizeMode={FastImage.resizeMode.cover}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <View
          testID="user-avatar-fallback"
          style={[styles.fallback, dynamicStyles.image]}
        >
          <AppText variant="bold" size={size * 0.4} style={styles.fallbackText}>
            {initial}
          </AppText>
        </View>
      )}

      {showBadge && <View style={[styles.onlineBadge, dynamicStyles.badge]} />}
    </TouchableOpacity>
  );
};
