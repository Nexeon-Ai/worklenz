import { Table, TableProps, Typography } from '@/shared/antd-imports';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IOrganizationAdmin } from '@/types/admin-center/admin-center.types';

interface OrganizationAdminsTableProps {
  organizationAdmins: IOrganizationAdmin[] | null;
  loading: boolean;
  themeMode: string;
}

const { Text } = Typography;

const OrganizationAdminsTable: React.FC<OrganizationAdminsTableProps> = ({
  organizationAdmins,
  loading,
  themeMode,
}) => {
  const { t } = useTranslation('admin-center/overview');
  const columns = useMemo<TableProps<IOrganizationAdmin>['columns']>(
    () => [
      {
        title: <Text strong>{t('nameColumn')}</Text>,
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <div>
            <Text>
              {text}
              {record.is_owner && <Text>{t('ownerSuffix')}</Text>}
            </Text>
          </div>
        ),
      },
      {
        title: <Text strong>{t('emailColumn')}</Text>,
        dataIndex: 'email',
        key: 'email',
        render: text => <Text>{text}</Text>,
      },
    ],
    [t]
  );

  return (
    <Table<IOrganizationAdmin>
      className="organization-admins-table"
      columns={columns}
      dataSource={organizationAdmins || []}
      loading={loading}
      showHeader={false}
      pagination={{
        size: 'small',
        pageSize: 10,
        hideOnSinglePage: true,
      }}
      rowKey="email"
    />
  );
};

export default OrganizationAdminsTable;
