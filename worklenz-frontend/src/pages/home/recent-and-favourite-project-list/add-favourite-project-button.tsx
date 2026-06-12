import { StarFilled } from '@/shared/antd-imports';
import { Button, ConfigProvider, Tooltip } from '@/shared/antd-imports';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { colors } from '@/styles/colors';
import { IProjectViewModel } from '@/types/project/projectViewModel.types';
import { projectsApiService } from '@/api/projects/projects.api.service';

type AddFavouriteProjectButtonProps = {
  record: IProjectViewModel;
  handleRefresh: () => void;
};

const AddFavouriteProjectButton = ({ record, handleRefresh }: AddFavouriteProjectButtonProps) => {
  const { t } = useTranslation('home');
  const checkIconColor = useMemo(
    () => (record.favorite ? colors.yellow : colors.lightGray),
    [record.favorite]
  );

  const handleToggleFavoriteProject = async () => {
    if (!record.id) return;
    await projectsApiService.toggleFavoriteProject(record.id);
    handleRefresh();
  };

  return (
    <ConfigProvider wave={{ disabled: true }}>
      <Tooltip
        title={record.favorite ? t('projects.removeFromFavourites') : t('projects.addToFavourites')}
      >
        <Button
          type="text"
          className="borderless-icon-btn"
          style={{ backgroundColor: colors.transparent }}
          shape="circle"
          icon={<StarFilled style={{ color: checkIconColor }} />}
          onClick={handleToggleFavoriteProject}
        />
      </Tooltip>
    </ConfigProvider>
  );
};

export default AddFavouriteProjectButton;
