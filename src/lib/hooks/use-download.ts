import { toast } from '@baronha/ting';
import { useMutation } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system';

export function useDownload() {
  return useMutation({
    mutationFn: async (params: { filename: string; url: string }) => {
      const downloadResumable = FileSystem.createDownloadResumable(
        params.url,
        `${FileSystem.documentDirectory}${params.filename}.mp3`,
        {},
        // callback,
      );

      const res = await downloadResumable.downloadAsync();
      if (!res?.uri) throw new Error('Download failed');
      return res.uri;
    },
    onSettled: (_, error) => {
      if (error) {
        toast({
          preset: 'error',
          haptic: 'error',
          title: 'Failed to download',
          message: error.message,
        });
        return;
      }

      toast({
        preset: 'done',
        haptic: 'success',
        title: 'Downloaded',
      });
    },
  });
}
