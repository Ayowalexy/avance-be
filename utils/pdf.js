// https://mobillity-be.herokuapp.com/api/v1/payments/verify



export const create_pdf = (
    spendAnalysisReport, transactionpattern, cashFlowAnalysisPattern, behavioralAnalysisReport
) => {
    let str = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Statement</title>
</head>

<body style="font-family: Poppins-SemiBold; src: url(./assets/Poppins-SemiBold.ttf);">
    <div
        style="width: 100%; background-color: #fff; font-family: Poppins-Regular; src: url(./assets/Poppins-Regular.ttf);">
        <div
            style="display: flex; flex-direction: column; justify-content: center; padding-top: 30px; align-items: center; width: 100%; gap: 10px;">
            <svg width="180" height="50" viewBox="0 0 180 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2528_10973)">
            <path d="M2.05164 48.3905H11.8677C12.2025 48.3923 12.5324 48.3096 12.8267 48.15C14.9383 47.0091 23.7191 41.6216 29.2122 28.3067C29.3391 27.9965 29.3881 27.66 29.355 27.3265C29.3219 26.993 29.2076 26.6727 29.0222 26.3935C28.8367 26.1144 28.5858 25.8849 28.2912 25.725C27.9966 25.5652 27.6674 25.4799 27.3323 25.4766H17.3227C17.1615 25.4757 17.0008 25.4954 16.8446 25.5352C15.2844 25.9312 7.05204 28.7408 0.15119 45.5838C0.028587 45.8944 -0.0163975 46.2302 0.0201371 46.5622C0.0566717 46.8941 0.173623 47.2121 0.360848 47.4886C0.548074 47.7651 0.799923 47.9918 1.09456 48.1489C1.38919 48.3061 1.71771 48.389 2.05164 48.3905Z" fill="url(#paint0_linear_2528_10973)"/>
            <path d="M27.3359 23.9578H17.5052C17.1708 23.9592 16.8413 23.8776 16.5462 23.7203C14.4346 22.5824 5.65378 17.189 0.160663 3.87703C0.0338606 3.56707 -0.0151885 3.23079 0.017793 2.89753C0.0507745 2.56426 0.164785 2.24412 0.349883 1.96503C0.534981 1.68594 0.785546 1.45636 1.07973 1.29633C1.37391 1.13629 1.70278 1.05066 2.03765 1.04688H12.0502C12.2112 1.0464 12.3717 1.06511 12.5282 1.10261C14.0797 1.4956 22.3179 4.30228 29.2188 21.1482C29.3414 21.4576 29.3871 21.7922 29.3517 22.1231C29.3164 22.4541 29.2011 22.7714 29.0158 23.0479C28.8305 23.3244 28.5808 23.5517 28.2881 23.7102C27.9955 23.8687 27.6687 23.9537 27.3359 23.9578Z" fill="url(#paint1_linear_2528_10973)"/>
            <path d="M45.5316 18.4856C45.6055 17.2538 45.9134 16.2315 46.4554 15.4185C46.9974 14.6055 47.6872 13.9527 48.5248 13.46C49.3624 12.9673 50.2985 12.6224 51.3332 12.4253C52.3925 12.2036 53.4519 12.0927 54.5112 12.0927C55.472 12.0927 56.4451 12.1666 57.4305 12.3144C58.4159 12.4376 59.3151 12.6963 60.1281 13.0905C60.941 13.4846 61.6062 14.0389 62.1235 14.7533C62.6409 15.4431 62.8995 16.367 62.8995 17.5248V27.4652C62.8995 28.3275 62.9488 29.1528 63.0474 29.9411C63.1459 30.7294 63.3184 31.3207 63.5647 31.7148H58.2435C58.1449 31.4192 58.0587 31.1236 57.9848 30.828C57.9355 30.5077 57.8986 30.1874 57.8739 29.8672C57.0363 30.7294 56.0509 31.333 54.9177 31.6779C53.7844 32.0228 52.6266 32.1952 51.4441 32.1952C50.5326 32.1952 49.6826 32.0844 48.8943 31.8627C48.106 31.6409 47.4162 31.296 46.8249 30.828C46.2337 30.3599 45.7656 29.7686 45.4207 29.0542C45.1004 28.3398 44.9403 27.4899 44.9403 26.5044C44.9403 25.4205 45.1251 24.5336 45.4946 23.8438C45.8888 23.1294 46.3815 22.5628 46.9727 22.144C47.5886 21.7252 48.2784 21.4172 49.0421 21.2201C49.8304 20.9984 50.6188 20.826 51.4071 20.7028C52.1955 20.5796 52.9715 20.4811 53.7352 20.4072C54.4989 20.3333 55.1763 20.2224 55.7676 20.0746C56.3588 19.9268 56.8269 19.7174 57.1718 19.4464C57.5167 19.1508 57.6768 18.732 57.6522 18.19C57.6522 17.6234 57.5537 17.1799 57.3566 16.8597C57.1841 16.5148 56.9378 16.2561 56.6175 16.0837C56.3219 15.8866 55.9647 15.7634 55.5459 15.7141C55.1517 15.6402 54.7206 15.6033 54.2525 15.6033C53.2178 15.6033 52.4049 15.825 51.8136 16.2684C51.2224 16.7119 50.8775 17.4509 50.7789 18.4856H45.5316ZM57.6522 22.3657C57.4305 22.5628 57.1472 22.7229 56.8023 22.8461C56.482 22.9446 56.1248 23.0309 55.7306 23.1048C55.3611 23.1787 54.9669 23.2403 54.5481 23.2895C54.1293 23.3388 53.7105 23.4004 53.2917 23.4743C52.8976 23.5482 52.5034 23.6467 52.1092 23.7699C51.7397 23.8931 51.4071 24.0655 51.1115 24.2873C50.8405 24.4843 50.6188 24.743 50.4463 25.0633C50.2739 25.3835 50.1877 25.79 50.1877 26.2827C50.1877 26.7508 50.2739 27.145 50.4463 27.4652C50.6188 27.7855 50.8528 28.0442 51.1484 28.2412C51.4441 28.4137 51.789 28.5369 52.1831 28.6108C52.5773 28.6847 52.9838 28.7216 53.4026 28.7216C54.4373 28.7216 55.2379 28.5492 55.8045 28.2043C56.3712 27.8594 56.79 27.4529 57.061 26.9848C57.3319 26.4921 57.4921 25.9994 57.5413 25.5067C57.6152 25.014 57.6522 24.6198 57.6522 24.3242V22.3657ZM77.5411 31.7148L84.0079 12.6101H78.7975L74.7696 25.6545H74.6957L70.6678 12.6101H65.1618L71.7025 31.7148H77.5411ZM85.9491 18.4856C86.023 17.2538 86.3309 16.2315 86.8729 15.4185C87.4149 14.6055 88.1047 13.9527 88.9423 13.46C89.7799 12.9673 90.716 12.6224 91.7507 12.4253C92.8101 12.2036 93.8694 12.0927 94.9287 12.0927C95.8895 12.0927 96.8626 12.1666 97.848 12.3144C98.8334 12.4376 99.7326 12.6963 100.546 13.0905C101.359 13.4846 102.024 14.0389 102.541 14.7533C103.058 15.4431 103.317 16.367 103.317 17.5248V27.4652C103.317 28.3275 103.366 29.1528 103.465 29.9411C103.563 30.7294 103.736 31.3207 103.982 31.7148H98.661C98.5624 31.4192 98.4762 31.1236 98.4023 30.828C98.353 30.5077 98.3161 30.1874 98.2914 29.8672C97.4538 30.7294 96.4684 31.333 95.3352 31.6779C94.202 32.0228 93.0441 32.1952 91.8616 32.1952C90.9501 32.1952 90.1002 32.0844 89.3118 31.8627C88.5235 31.6409 87.8337 31.296 87.2424 30.828C86.6512 30.3599 86.1831 29.7686 85.8382 29.0542C85.518 28.3398 85.3578 27.4899 85.3578 26.5044C85.3578 25.4205 85.5426 24.5336 85.9121 23.8438C86.3063 23.1294 86.799 22.5628 87.3903 22.144C88.0061 21.7252 88.6959 21.4172 89.4596 21.2201C90.248 20.9984 91.0363 20.826 91.8246 20.7028C92.613 20.5796 93.389 20.4811 94.1527 20.4072C94.9164 20.3333 95.5939 20.2224 96.1851 20.0746C96.7764 19.9268 97.2444 19.7174 97.5893 19.4464C97.9342 19.1508 98.0944 18.732 98.0697 18.19C98.0697 17.6234 97.9712 17.1799 97.7741 16.8597C97.6016 16.5148 97.3553 16.2561 97.035 16.0837C96.7394 15.8866 96.3822 15.7634 95.9634 15.7141C95.5692 15.6402 95.1381 15.6033 94.67 15.6033C93.6353 15.6033 92.8224 15.825 92.2311 16.2684C91.6399 16.7119 91.295 17.4509 91.1964 18.4856H85.9491ZM98.0697 22.3657C97.848 22.5628 97.5647 22.7229 97.2198 22.8461C96.8995 22.9446 96.5423 23.0309 96.1482 23.1048C95.7786 23.1787 95.3845 23.2403 94.9657 23.2895C94.5469 23.3388 94.128 23.4004 93.7092 23.4743C93.3151 23.5482 92.9209 23.6467 92.5267 23.7699C92.1572 23.8931 91.8246 24.0655 91.529 24.2873C91.258 24.4843 91.0363 24.743 90.8639 25.0633C90.6914 25.3835 90.6052 25.79 90.6052 26.2827C90.6052 26.7508 90.6914 27.145 90.8639 27.4652C91.0363 27.7855 91.2703 28.0442 91.566 28.2412C91.8616 28.4137 92.2065 28.5369 92.6007 28.6108C92.9948 28.6847 93.4013 28.7216 93.8201 28.7216C94.8548 28.7216 95.6554 28.5492 96.2221 28.2043C96.7887 27.8594 97.2075 27.4529 97.4785 26.9848C97.7495 26.4921 97.9096 25.9994 97.9589 25.5067C98.0328 25.014 98.0697 24.6198 98.0697 24.3242V22.3657ZM107.39 12.6101V31.7148H112.637V21.7005C112.637 19.7543 112.958 18.3624 113.598 17.5248C114.239 16.6626 115.273 16.2315 116.702 16.2315C117.959 16.2315 118.833 16.6256 119.326 17.414C119.819 18.1777 120.065 19.3479 120.065 20.9245V31.7148H125.312V19.9637C125.312 18.7812 125.201 17.7096 124.98 16.7488C124.783 15.7634 124.425 14.9381 123.908 14.273C123.391 13.5832 122.676 13.0535 121.765 12.684C120.878 12.2898 119.732 12.0927 118.328 12.0927C117.22 12.0927 116.136 12.3514 115.076 12.8687C114.017 13.3614 113.155 14.1621 112.49 15.2707H112.379V12.6101H107.39ZM142.302 19.3355H147.439C147.365 18.1038 147.069 17.0444 146.552 16.1576C146.035 15.2461 145.357 14.4947 144.52 13.9034C143.707 13.2875 142.77 12.8318 141.711 12.5362C140.676 12.2405 139.592 12.0927 138.459 12.0927C136.907 12.0927 135.528 12.3514 134.32 12.8687C133.113 13.3861 132.091 14.1128 131.253 15.049C130.416 15.9605 129.775 17.0568 129.332 18.3378C128.913 19.5942 128.704 20.9615 128.704 22.4396C128.704 23.8685 128.938 25.1865 129.406 26.3936C129.874 27.5761 130.527 28.5985 131.364 29.4607C132.202 30.3229 133.212 31.0004 134.394 31.4931C135.602 31.9612 136.92 32.1952 138.348 32.1952C140.886 32.1952 142.968 31.5301 144.593 30.1998C146.219 28.8695 147.205 26.9356 147.55 24.3981H142.487C142.315 25.5806 141.884 26.5291 141.194 27.2435C140.529 27.9333 139.568 28.2782 138.311 28.2782C137.498 28.2782 136.809 28.0934 136.242 27.7239C135.675 27.3544 135.22 26.8863 134.875 26.3197C134.555 25.7284 134.32 25.0756 134.173 24.3612C134.025 23.6467 133.951 22.9446 133.951 22.2548C133.951 21.5404 134.025 20.826 134.173 20.1116C134.32 19.3725 134.567 18.7073 134.912 18.1161C135.281 17.5002 135.749 17.0075 136.316 16.638C136.883 16.2438 137.585 16.0467 138.422 16.0467C140.664 16.0467 141.957 17.143 142.302 19.3355ZM163.374 20.1116H154.838C154.862 19.742 154.936 19.3232 155.059 18.8551C155.207 18.3871 155.441 17.9436 155.761 17.5248C156.106 17.106 156.55 16.7611 157.092 16.4901C157.658 16.1945 158.36 16.0467 159.198 16.0467C160.479 16.0467 161.428 16.3916 162.043 17.0814C162.684 17.7712 163.127 18.7812 163.374 20.1116ZM154.838 23.4373H168.621C168.72 21.9592 168.596 20.5427 168.252 19.1877C167.907 17.8328 167.34 16.6256 166.552 15.5663C165.788 14.507 164.803 13.6694 163.595 13.0535C162.388 12.413 160.972 12.0927 159.346 12.0927C157.892 12.0927 156.562 12.3514 155.355 12.8687C154.172 13.3861 153.15 14.1005 152.288 15.012C151.426 15.8989 150.76 16.9582 150.292 18.19C149.824 19.4218 149.59 20.7521 149.59 22.1809C149.59 23.6591 149.812 25.014 150.255 26.2458C150.723 27.4775 151.376 28.5369 152.214 29.4237C153.051 30.3106 154.074 31.0004 155.281 31.4931C156.488 31.9612 157.843 32.1952 159.346 32.1952C161.514 32.1952 163.361 31.7025 164.889 30.7171C166.416 29.7317 167.549 28.0934 168.289 25.8023H163.669C163.497 26.3936 163.029 26.9602 162.265 27.5022C161.501 28.0195 160.59 28.2782 159.531 28.2782C158.052 28.2782 156.919 27.8964 156.131 27.1327C155.343 26.369 154.911 25.1372 154.838 23.4373ZM171.955 26.0241V31.7148H177.757V26.0241H171.955Z" fill="#333333"/>
            <path d="M2.05164 48.3905H11.8677C12.2025 48.3923 12.5324 48.3096 12.8267 48.15C14.9383 47.0091 23.7191 41.6216 29.2122 28.3067C29.3391 27.9965 29.3881 27.66 29.355 27.3265C29.3219 26.993 29.2076 26.6727 29.0222 26.3935C28.8367 26.1144 28.5858 25.8849 28.2912 25.725C27.9966 25.5652 27.6674 25.4799 27.3323 25.4766H17.3227C17.1615 25.4757 17.0008 25.4954 16.8446 25.5352C15.2844 25.9312 7.05204 28.7408 0.15119 45.5838C0.028587 45.8944 -0.0163975 46.2302 0.0201371 46.5622C0.0566717 46.8941 0.173623 47.2121 0.360848 47.4886C0.548074 47.7651 0.799923 47.9918 1.09456 48.1489C1.38919 48.3061 1.71771 48.389 2.05164 48.3905Z" fill="url(#paint2_linear_2528_10973)"/>
            <path d="M27.3359 23.9578H17.5052C17.1708 23.9592 16.8413 23.8776 16.5462 23.7203C14.4346 22.5824 5.65378 17.189 0.160663 3.87703C0.0338606 3.56707 -0.0151885 3.23079 0.017793 2.89753C0.0507745 2.56426 0.164785 2.24412 0.349883 1.96503C0.534981 1.68594 0.785546 1.45636 1.07973 1.29633C1.37391 1.13629 1.70278 1.05066 2.03765 1.04688H12.0502C12.2112 1.0464 12.3717 1.06511 12.5282 1.10261C14.0797 1.4956 22.3179 4.30228 29.2188 21.1482C29.3414 21.4576 29.3871 21.7922 29.3517 22.1231C29.3164 22.4541 29.2011 22.7714 29.0158 23.0479C28.8305 23.3244 28.5808 23.5517 28.2881 23.7102C27.9955 23.8687 27.6687 23.9537 27.3359 23.9578Z" fill="url(#paint3_linear_2528_10973)"/>
            <path d="M45.5238 18.4856C45.5977 17.2538 45.9056 16.2315 46.4476 15.4185C46.9896 14.6055 47.6794 13.9527 48.517 13.46C49.3546 12.9673 50.2907 12.6224 51.3254 12.4253C52.3847 12.2036 53.444 12.0927 54.5034 12.0927C55.4642 12.0927 56.4373 12.1666 57.4227 12.3144C58.4081 12.4376 59.3073 12.6963 60.1203 13.0905C60.9332 13.4846 61.5984 14.0389 62.1157 14.7533C62.6331 15.4431 62.8917 16.367 62.8917 17.5248V27.4652C62.8917 28.3275 62.941 29.1528 63.0395 29.9411C63.1381 30.7294 63.3105 31.3207 63.5569 31.7148H58.2356C58.1371 31.4192 58.0509 31.1236 57.977 30.828C57.9277 30.5077 57.8907 30.1874 57.8661 29.8672C57.0285 30.7294 56.0431 31.333 54.9099 31.6779C53.7766 32.0228 52.6188 32.1952 51.4363 32.1952C50.5247 32.1952 49.6748 32.0844 48.8865 31.8627C48.0982 31.6409 47.4084 31.296 46.8171 30.828C46.2259 30.3599 45.7578 29.7686 45.4129 29.0542C45.0926 28.3398 44.9325 27.4899 44.9325 26.5044C44.9325 25.4205 45.1173 24.5336 45.4868 23.8438C45.881 23.1294 46.3737 22.5628 46.9649 22.144C47.5808 21.7252 48.2706 21.4172 49.0343 21.2201C49.8226 20.9984 50.611 20.826 51.3993 20.7028C52.1876 20.5796 52.9637 20.4811 53.7274 20.4072C54.4911 20.3333 55.1685 20.2224 55.7598 20.0746C56.351 19.9268 56.8191 19.7174 57.164 19.4464C57.5089 19.1508 57.669 18.732 57.6444 18.19C57.6444 17.6234 57.5458 17.1799 57.3488 16.8597C57.1763 16.5148 56.93 16.2561 56.6097 16.0837C56.3141 15.8866 55.9569 15.7634 55.5381 15.7141C55.1439 15.6402 54.7128 15.6033 54.2447 15.6033C53.21 15.6033 52.397 15.825 51.8058 16.2684C51.2145 16.7119 50.8696 17.4509 50.7711 18.4856H45.5238ZM57.6444 22.3657C57.4227 22.5628 57.1394 22.7229 56.7945 22.8461C56.4742 22.9446 56.117 23.0309 55.7228 23.1048C55.3533 23.1787 54.9591 23.2403 54.5403 23.2895C54.1215 23.3388 53.7027 23.4004 53.2839 23.4743C52.8897 23.5482 52.4956 23.6467 52.1014 23.7699C51.7319 23.8931 51.3993 24.0655 51.1037 24.2873C50.8327 24.4843 50.611 24.743 50.4385 25.0633C50.2661 25.3835 50.1799 25.79 50.1799 26.2827C50.1799 26.7508 50.2661 27.145 50.4385 27.4652C50.611 27.7855 50.845 28.0442 51.1406 28.2412C51.4363 28.4137 51.7812 28.5369 52.1753 28.6108C52.5695 28.6847 52.976 28.7216 53.3948 28.7216C54.4295 28.7216 55.2301 28.5492 55.7967 28.2043C56.3633 27.8594 56.7821 27.4529 57.0531 26.9848C57.3241 26.4921 57.4843 25.9994 57.5335 25.5067C57.6074 25.014 57.6444 24.6198 57.6444 24.3242V22.3657ZM77.5333 31.7148L84.0001 12.6101H78.7897L74.7618 25.6545H74.6879L70.66 12.6101H65.154L71.6947 31.7148H77.5333ZM85.9413 18.4856C86.0152 17.2538 86.3231 16.2315 86.8651 15.4185C87.4071 14.6055 88.0969 13.9527 88.9345 13.46C89.7721 12.9673 90.7082 12.6224 91.7429 12.4253C92.8022 12.2036 93.8616 12.0927 94.9209 12.0927C95.8817 12.0927 96.8548 12.1666 97.8402 12.3144C98.8256 12.4376 99.7248 12.6963 100.538 13.0905C101.351 13.4846 102.016 14.0389 102.533 14.7533C103.051 15.4431 103.309 16.367 103.309 17.5248V27.4652C103.309 28.3275 103.359 29.1528 103.457 29.9411C103.556 30.7294 103.728 31.3207 103.974 31.7148H98.6532C98.5546 31.4192 98.4684 31.1236 98.3945 30.828C98.3452 30.5077 98.3083 30.1874 98.2836 29.8672C97.446 30.7294 96.4606 31.333 95.3274 31.6779C94.1941 32.0228 93.0363 32.1952 91.8538 32.1952C90.9423 32.1952 90.0923 32.0844 89.304 31.8627C88.5157 31.6409 87.8259 31.296 87.2346 30.828C86.6434 30.3599 86.1753 29.7686 85.8304 29.0542C85.5102 28.3398 85.35 27.4899 85.35 26.5044C85.35 25.4205 85.5348 24.5336 85.9043 23.8438C86.2985 23.1294 86.7912 22.5628 87.3824 22.144C87.9983 21.7252 88.6881 21.4172 89.4518 21.2201C90.2402 20.9984 91.0285 20.826 91.8168 20.7028C92.6052 20.5796 93.3812 20.4811 94.1449 20.4072C94.9086 20.3333 95.586 20.2224 96.1773 20.0746C96.7685 19.9268 97.2366 19.7174 97.5815 19.4464C97.9264 19.1508 98.0865 18.732 98.0619 18.19C98.0619 17.6234 97.9634 17.1799 97.7663 16.8597C97.5938 16.5148 97.3475 16.2561 97.0272 16.0837C96.7316 15.8866 96.3744 15.7634 95.9556 15.7141C95.5614 15.6402 95.1303 15.6033 94.6622 15.6033C93.6275 15.6033 92.8146 15.825 92.2233 16.2684C91.6321 16.7119 91.2872 17.4509 91.1886 18.4856H85.9413ZM98.0619 22.3657C97.8402 22.5628 97.5569 22.7229 97.212 22.8461C96.8917 22.9446 96.5345 23.0309 96.1403 23.1048C95.7708 23.1787 95.3766 23.2403 94.9578 23.2895C94.539 23.3388 94.1202 23.4004 93.7014 23.4743C93.3073 23.5482 92.9131 23.6467 92.5189 23.7699C92.1494 23.8931 91.8168 24.0655 91.5212 24.2873C91.2502 24.4843 91.0285 24.743 90.856 25.0633C90.6836 25.3835 90.5974 25.79 90.5974 26.2827C90.5974 26.7508 90.6836 27.145 90.856 27.4652C91.0285 27.7855 91.2625 28.0442 91.5582 28.2412C91.8538 28.4137 92.1987 28.5369 92.5928 28.6108C92.987 28.6847 93.3935 28.7216 93.8123 28.7216C94.847 28.7216 95.6476 28.5492 96.2142 28.2043C96.7809 27.8594 97.1997 27.4529 97.4707 26.9848C97.7416 26.4921 97.9018 25.9994 97.951 25.5067C98.025 25.014 98.0619 24.6198 98.0619 24.3242V22.3657ZM107.382 12.6101V31.7148H112.63V21.7005C112.63 19.7543 112.95 18.3624 113.59 17.5248C114.231 16.6626 115.266 16.2315 116.694 16.2315C117.951 16.2315 118.825 16.6256 119.318 17.414C119.811 18.1777 120.057 19.3479 120.057 20.9245V31.7148H125.304V19.9637C125.304 18.7812 125.194 17.7096 124.972 16.7488C124.775 15.7634 124.418 14.9381 123.9 14.273C123.383 13.5832 122.668 13.0535 121.757 12.684C120.87 12.2898 119.725 12.0927 118.32 12.0927C117.212 12.0927 116.128 12.3514 115.068 12.8687C114.009 13.3614 113.147 14.1621 112.482 15.2707H112.371V12.6101H107.382ZM142.295 19.3355H147.431C147.357 18.1038 147.062 17.0444 146.544 16.1576C146.027 15.2461 145.349 14.4947 144.512 13.9034C143.699 13.2875 142.763 12.8318 141.703 12.5362C140.669 12.2405 139.585 12.0927 138.451 12.0927C136.899 12.0927 135.52 12.3514 134.313 12.8687C133.106 13.3861 132.083 14.1128 131.246 15.049C130.408 15.9605 129.767 17.0568 129.324 18.3378C128.905 19.5942 128.696 20.9615 128.696 22.4396C128.696 23.8685 128.93 25.1865 129.398 26.3936C129.866 27.5761 130.519 28.5985 131.356 29.4607C132.194 30.3229 133.204 31.0004 134.387 31.4931C135.594 31.9612 136.912 32.1952 138.341 32.1952C140.878 32.1952 142.96 31.5301 144.586 30.1998C146.212 28.8695 147.197 26.9356 147.542 24.3981H142.479C142.307 25.5806 141.876 26.5291 141.186 27.2435C140.521 27.9333 139.56 28.2782 138.304 28.2782C137.491 28.2782 136.801 28.0934 136.234 27.7239C135.668 27.3544 135.212 26.8863 134.867 26.3197C134.547 25.7284 134.313 25.0756 134.165 24.3612C134.017 23.6467 133.943 22.9446 133.943 22.2548C133.943 21.5404 134.017 20.826 134.165 20.1116C134.313 19.3725 134.559 18.7073 134.904 18.1161C135.273 17.5002 135.742 17.0075 136.308 16.638C136.875 16.2438 137.577 16.0467 138.414 16.0467C140.656 16.0467 141.95 17.143 142.295 19.3355ZM163.366 20.1116H154.83C154.854 19.742 154.928 19.3232 155.051 18.8551C155.199 18.3871 155.433 17.9436 155.754 17.5248C156.098 17.106 156.542 16.7611 157.084 16.4901C157.651 16.1945 158.353 16.0467 159.19 16.0467C160.471 16.0467 161.42 16.3916 162.036 17.0814C162.676 17.7712 163.12 18.7812 163.366 20.1116ZM154.83 23.4373H168.613C168.712 21.9592 168.589 20.5427 168.244 19.1877C167.899 17.8328 167.332 16.6256 166.544 15.5663C165.78 14.507 164.795 13.6694 163.588 13.0535C162.381 12.413 160.964 12.0927 159.338 12.0927C157.885 12.0927 156.554 12.3514 155.347 12.8687C154.165 13.3861 153.142 14.1005 152.28 15.012C151.418 15.8989 150.753 16.9582 150.285 18.19C149.816 19.4218 149.582 20.7521 149.582 22.1809C149.582 23.6591 149.804 25.014 150.248 26.2458C150.716 27.4775 151.368 28.5369 152.206 29.4237C153.044 30.3106 154.066 31.0004 155.273 31.4931C156.48 31.9612 157.835 32.1952 159.338 32.1952C161.506 32.1952 163.354 31.7025 164.881 30.7171C166.408 29.7317 167.542 28.0934 168.281 25.8023H163.662C163.489 26.3936 163.021 26.9602 162.257 27.5022C161.494 28.0195 160.582 28.2782 159.523 28.2782C158.045 28.2782 156.911 27.8964 156.123 27.1327C155.335 26.369 154.904 25.1372 154.83 23.4373ZM171.947 26.0241V31.7148H177.749V26.0241H171.947Z" fill="#333333"/>
            </g>
            <defs>
            <linearGradient id="paint0_linear_2528_10973" x1="-0.00131523" y1="36.9409" x2="29.3706" y2="36.9409" gradientUnits="userSpaceOnUse">
            <stop stop-color="#2677F9" stop-opacity="0.2"/>
            <stop offset="1" stop-color="#C052FF" stop-opacity="0.8"/>
            </linearGradient>
            <linearGradient id="paint1_linear_2528_10973" x1="20.875" y1="23.0575" x2="2.56848" y2="-8.65185" gradientUnits="userSpaceOnUse">
            <stop offset="0.27" stop-color="#4187F7"/>
            <stop offset="1" stop-color="#2677F9" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="paint2_linear_2528_10973" x1="-0.00131523" y1="36.9409" x2="29.3706" y2="36.9409" gradientUnits="userSpaceOnUse">
            <stop stop-color="#2677F9" stop-opacity="0.2"/>
            <stop offset="1" stop-color="#C052FF" stop-opacity="0.8"/>
            </linearGradient>
            <linearGradient id="paint3_linear_2528_10973" x1="20.875" y1="23.0575" x2="2.56848" y2="-8.65185" gradientUnits="userSpaceOnUse">
            <stop offset="0.27" stop-color="#4187F7"/>
            <stop offset="1" stop-color="#2677F9" stop-opacity="0"/>
            </linearGradient>
            <clipPath id="clip0_2528_10973">
            <rect width="180" height="49.4439" fill="white"/>
            </clipPath>
            </defs>
            </svg>

            <p style="font-family: Poppins-SemiBold; color: #000;">Copy of Full Report Analysis Done on your Account</p>
            <div style=" width: 90%; border: 0.6px solid #116CFD;"></div>
        </div>

        <div style="padding: 30px; padding-top: 100px;">
            <div>
                <div style="font-size: 16px; font-family: Poppins-SemiBold;">Spend analysis</div>
                <div style="font-family: Poppins-Regular; color: #8F8F8F; font-size: 15px;">Here is a report of your
                    spending analysed over a month period.</div>
                <div
                    style="display: flex; width: 100%; justify-content: space-between; align-items: center; padding-top: 40px;">
                    <div
                        style="width: 28%; padding: 20px; height: 78px; border-radius: 8px; background-color: #F6F6F6; border: 1px solid rgba(38, 119, 249, 0.4);">
                        <div style="font-size: 14px; color: #243656; font-family: Poppins-SemiBold;">Highest Spend
                            <br /><span style="color: #116CFD;">₦${spendAnalysisReport.highestSpend}</span>
                        </div>
                        <div
                            style="font-family: Poppins-Light; src: url(./assets/Poppins-Light.ttf); color: #243656; font-size: 13px; padding-top: 10px; font-family: Poppins-Light;">
                            On October 2022</div>
                    </div>
                    <div
                        style="width: 28%; padding: 20px; height: 78px; border-radius: 8px; background-color: #F6F6F6; border: 1px solid rgba(38, 119, 249, 0.4);">
                        <div style="font-size: 14px; color: #243656; font-family: Poppins-SemiBold;">Total Expenses
                            <br /><span style="color: #116CFD;">₦${spendAnalysisReport.totalExpenses}</span>
                        </div>
                        <div
                            style="font-family: Poppins-Light; src: url(./assets/Poppins-Light.ttf); color: #243656; font-size: 13px; padding-top: 10px; font-family: Poppins-Light;">
                            On October 2022</div>
                    </div>
                    <div
                        style="width: 28%; padding: 20px; height: 78px; border-radius: 8px; background-color: #F6F6F6; border: 1px solid rgba(38, 119, 249, 0.4);">
                        <div style="font-size: 14px; color: #243656; font-family: Poppins-SemiBold;">Average Monthly
                            Expense
                            <br /><span
                                style="color: #116CFD;">₦${spendAnalysisReport.averageMonthlyTotalExpenses}</span>
                        </div>
                        <div
                            style="font-family: Poppins-Light; src: url(./assets/Poppins-Light.ttf); color: #243656; font-size: 13px; padding-top: 10px; font-family: Poppins-Light;">
                            On October 2022</div>
                    </div>
                </div>
            </div>


            <div style="padding-top: 80px; display: flex; justify-content: space-between; align-items: center;">
                <div style="width: 28%;">
                    <div style="font-family: Poppins-SemiBold; font-size: 16px; color: #000; padding-bottom: 20px;">
                        Expense</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">ATM
                        Withdrawls And POS</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        Airtime And Data</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        Charges And Stamp Duty</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        Entertainment</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        Online and Web</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        others</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        Transfer</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        USSD</div>
                </div>
                <div style="width: 28%;">
                    <div style="font-family: Poppins-SemiBold; font-size: 16px; color: #000; padding-bottom: 20px;">
                        Expense</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        ₦${spendAnalysisReport.averageMonthlySpendOnAtmAndPOS}</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        ₦${spendAnalysisReport.averageMonthlySpendOnAirtimeAndData}</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        ₦${spendAnalysisReport.averageMonthlySpendOnChargesAndStampDuty}</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        ₦${spendAnalysisReport.averageMonthlySpendOnEntertainment}</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        ₦${spendAnalysisReport.averageMonthlySpendOnOnlineAndWeb}</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        ₦${spendAnalysisReport.averageMonthlySpendOnOthers}</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        ₦${spendAnalysisReport.averageMonthlySpendOnTransfer}</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        ₦${spendAnalysisReport.averageMonthlySpendOnUSSD}</div>
                </div>
                <div style="width: 28%;">
                    <div style="font-family: Poppins-SemiBold; font-size: 16px; color: #000; padding-bottom: 20px;">
                        Total Spending</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        ₦${spendAnalysisReport.totalSpendOnAtmAndPOS}</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        ₦${spendAnalysisReport.totalSpendOnAirtimeAndData}</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        ₦${spendAnalysisReport.totalSpendOnChargesAndStampDuty}</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        ₦${spendAnalysisReport.totalSpendOnEntertainment}</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        ₦${spendAnalysisReport.totalSpendOnOnlineAndWeb}</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        ₦30833</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        ₦${spendAnalysisReport.totalSpendOnTransfer}</div>
                    <div style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                        ₦${spendAnalysisReport.totalSpendOnUSSD}</div>
                </div>
            </div>
          

            <div>
                <div style="font-size: 16px; font-family: Poppins-SemiBold;">Transaction Pattern</div>
                <div style="font-family: Poppins-Regular; color: #8F8F8F; font-size: 15px;">Here is a report of your
                    debit and credit pattern analysed over a month period (Oct 1st-Oct 31st 2022).</div>

                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="width: 48%;">
                    <svg width="350" height="350" viewBox="0 0 350 350" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M350 175C350 271.65 271.65 350 175 350C78.3502 350 0 271.65 0 175C0 78.3502 78.3502 0 175 0C271.65 0 350 78.3502 350 175ZM66.4648 175C66.4648 234.942 115.058 283.535 175 283.535C234.942 283.535 283.535 234.942 283.535 175C283.535 115.058 234.942 66.4648 175 66.4648C115.058 66.4648 66.4648 115.058 66.4648 175Z" fill="#324B78"/>
                    <path d="M2.68499 144.462C7.50412 117.269 18.6906 91.603 35.3299 69.5616C51.9691 47.5202 73.5887 29.7298 98.4209 17.6448L127.506 77.4082C112.105 84.9033 98.6961 95.9369 88.3764 109.607C78.0567 123.277 71.1189 139.195 68.13 156.061L2.68499 144.462Z" fill="#2075FD"/>
                    </svg>
                    
                    </div>
                    <div style="width: 28%;">
                        <div
                            style="display: flex; padding-bottom: 40px; justify-content: space-between; align-items: center; gap: 50px;">
                            <div style="color: #5478B7; font-family: Poppins-Regular; font-size: 14px;">Total Number of
                                Transactions</div>
                            <div style="color: #5478B7; font-family: Poppins-Regular; font-size: 14px;">
                                ${transactionpattern.totalNumberOfTransactions}</div>
                        </div>
                        <div
                            style="display: flex; padding-bottom: 40px; justify-content: space-between; align-items: center; gap: 50px;">
                            <div style="color: #5478B7; font-family: Poppins-Regular; font-size: 14px;">Debit
                                Transactions</div>
                            <div style="color: #5478B7; font-family: Poppins-Regular; font-size: 14px;">
                                ${transactionpattern.percentDebitTransactions}%</div>
                        </div>
                        <div
                            style="display: flex; padding-bottom: 40px; justify-content: space-between; align-items: center; gap: 50px;">
                            <div style="color: #5478B7; font-family: Poppins-Regular; font-size: 14px;">Credit
                                Transactions</div>
                            <div style="color: #5478B7; font-family: Poppins-Regular; font-size: 14px;">
                                ${transactionpattern.percentCreditTransactions}%</div>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>

                <div style="padding-top: 80px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="width: 25%;">
                        <div style="font-family: Poppins-SemiBold; font-size: 16px; color: #000; padding-bottom: 20px;">
                            Transaction</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ₦0-10,000</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ₦10,000-100,000</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ₦100,000-500,000</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ₦500,000-1,000,000</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ₦1,000,000 and Above</div>
                        
                    </div>
                    <div style="width: 25%;">
                        <div style="font-family: Poppins-SemiBold; font-size: 16px; color: #000; padding-bottom: 20px;">
                            Transaction Percentage</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ${transactionpattern.percentOfTransactionsLessThan10ThousandNaira}</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ${transactionpattern.percentOfTransactionsBetween10ThousandTo100ThousandNaira}</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ${transactionpattern.percentOfTransactionsBetween100ThousandTo500ThousandNaira}</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ${transactionpattern.percentOfTransactionsBetween500ThousandToOneMillionNaira}</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ${transactionpattern.percentOfTransactionsBetween500ThousandToOneMillionNaira}</div>

                    </div>
                    <div style="width: 25%;">
                        <div style="font-family: Poppins-SemiBold; font-size: 16px; color: #000; padding-bottom: 20px;">
                            Balance</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ₦0-10,000</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ₦10,000-100,000</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ₦100,000-500,000</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ₦500,000-1,000,000</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ₦1,000,000 and above</div>

                    </div>
                    <div style="width: 25%;">
                        <div style="font-family: Poppins-SemiBold; font-size: 16px; color: #000; padding-bottom: 20px;">
                            Balance amount(%)</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ${transactionpattern.percentOfBalancesLessThan10ThousandNaira}</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ${transactionpattern.percentOfBalancesBetween10ThousandTo100ThousandNaira}</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ${transactionpattern.percentOfBalancesBetween500ThousandToOneMillionNaira}</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ${transactionpattern.percentOfBalancesGreaterThanOneMillionNaira}</div>
                        <div
                            style="font-family: Poppins-Regular; font-size: 14px; color:#243656; padding-bottom: 20px;">
                            ${transactionpattern.percentOfBalancesGreaterThanOneMillionNaira}</div>

                    </div>

                </div>

                <div style="padding-top: 80px;">
                    <div style="display: flex; justify-content: center; align-items: center; gap: 100px;">
                        <div style="color: #324B78; font-family: Poppins-Regular; font-size: 16px;">
                            Most Frequent Balance Range
                        </div>
                        <div style="color: #324B78; font-family: Poppins-Regular; font-size: 16px;">₦${transactionpattern.mostFrequentBalanceRange}
                        </div>
                    </div>
                    <div
                        style="display: flex; padding-top: 40px; justify-content: center; align-items: center; gap: 100px;">
                        <div style="color: #324B78; font-family: Poppins-Regular; font-size: 16px;">
                            Most Frequent Transaction Range
                        </div>
                        <div style="color: #324B78; font-family: Poppins-Regular; font-size: 16px;">₦${transactionpattern.mostFrequentTransactionRange}
                        </div>
                    </div>
                </div>
                <div
                    style="height: 7px; width: 200%; margin-top: 100px; margin-bottom: 100px; background-color: rgba(217, 217, 217, 0.7); margin-left: -400px;">
                </div>

                <div>
                    <div style="font-size: 16px; font-family: Poppins-SemiBold;">Cash Flow </div>
                    <div style="font-family: Poppins-Regular; color: #8F8F8F; font-size: 15px;">Here is a report of your
                        cash inflow and outflow analysed over a month period</div>
                    <div
                        style="display: flex; width: 100%; justify-content: space-between; align-items: center; padding-top: 40px;">
                        <div
                            style="width: 28%; padding: 20px; height: 78px; border-radius: 8px; background-color: #F6F6F6; border: 1px solid rgba(38, 119, 249, 0.4);">
                            <div style="font-size: 14px; color: #243656; font-family: Poppins-SemiBold;">Valid Credit
                                <br /><br /><span style="color: #116CFD; padding-top: 30px;">₦${cashFlowAnalysisPattern.validCredit}</span>
                            </div>

                        </div>
                        <div
                            style="width: 28%; padding: 20px; height: 78px; border-radius: 8px; background-color: #F6F6F6; border: 1px solid rgba(38, 119, 249, 0.4);">
                            <div style="font-size: 14px; color: #243656; font-family: Poppins-SemiBold;">Closing Balance
                                <br /><br /><span style="color: #116CFD;">₦${cashFlowAnalysisPattern.closingBalance}</span>
                            </div>

                        </div>
                        <div
                            style="width: 28%; padding: 20px; height: 78px; border-radius: 8px; background-color: #F6F6F6; border: 1px solid rgba(38, 119, 249, 0.4);">
                            <div style="font-size: 14px; color: #243656; font-family: Poppins-SemiBold;">
                                Percentage of Expense Over Inflow
                                <br /><br /><span style="color: #116CFD;">₦${cashFlowAnalysisPattern.percentageOfExpenseOverInflow}</span>
                            </div>

                        </div>
                    </div>
                </div>

                <div style="padding-top: 60px;">
                    <div style="border: 1px solid #116CFD; display: flex;">
                        <div
                            style="width: 50%; color: #243656; height: 54px; font-family: Poppins-Regular; display: flex; justify-content: flex-start; align-items: center; padding-left: 20px;">
                            <div>Total Credit Turnover</div>
                        </div>
                        <div
                            style="width: 50%; color: #116CFD; border-left: 1px solid #116CFD; height: 54px; font-family: Poppins-SemiBold; display: flex; justify-content: flex-start; align-items: center; padding-left: 20px;">
                            <div>₦${cashFlowAnalysisPattern.totalCreditTurnover}</div>
                        </div>
                    </div>
                    <div style="border: 1px solid #116CFD; background-color: #f0f7fe; display: flex;">
                        <div
                            style="width: 50%; height: 54px; color: #243656; font-family: Poppins-Regular; display: flex; justify-content: flex-start; align-items: center; padding-left: 20px;">
                            <div>Total Debit Turnover</div>
                        </div>
                        <div
                            style="width: 50%; color: #116CFD; border-left: 1px solid #116CFD; height: 54px; font-family: Poppins-SemiBold; display: flex; justify-content: flex-start; align-items: center; padding-left: 20px;">
                            <div>₦${cashFlowAnalysisPattern.totalDebitTurnOver}</div>
                        </div>
                    </div>
                    <div style="border: 1px solid #116CFD;  display: flex;">
                        <div
                            style="width: 50%; height: 54px; color: #243656; font-family: Poppins-Regular; display: flex; justify-content: flex-start; align-items: center; padding-left: 20px;">
                            <div>Average Monthly Credits</div>
                        </div>
                        <div
                            style="width: 50%; color: #116CFD; border-left: 1px solid #116CFD; height: 54px; font-family: Poppins-SemiBold; display: flex; justify-content: flex-start; align-items: center; padding-left: 20px;">
                            <div>₦${cashFlowAnalysisPattern.averageWeeklyCredits}</div>
                        </div>
                    </div>
                    <div style="border: 1px solid #116CFD; background-color: #f0f7fe; display: flex;">
                        <div
                            style="width: 50%; height: 54px; color: #243656; font-family: Poppins-Regular; display: flex; justify-content: flex-start; align-items: center; padding-left: 20px;">
                            <div>Average Monthly Debits</div>
                        </div>
                        <div
                            style="width: 50%; color: #116CFD; border-left: 1px solid #116CFD; height: 54px; font-family: Poppins-SemiBold; display: flex; justify-content: flex-start; align-items: center; padding-left: 20px;">
                            <div>₦${cashFlowAnalysisPattern.averageMonthlyDebits}</div>
                        </div>
                    </div>
                    <div style="border: 1px solid #116CFD; display: flex;">
                        <div
                            style="width: 50%; height: 54px; color: #243656; font-family: Poppins-Regular; display: flex; justify-content: flex-start; align-items: center; padding-left: 20px;">
                            <div>Average Weekly Credits</div>
                        </div>
                        <div
                            style="width: 50%; color: #116CFD; border-left: 1px solid #116CFD; height: 54px; font-family: Poppins-SemiBold; display: flex; justify-content: flex-start; align-items: center; padding-left: 20px;">
                            <div>₦${cashFlowAnalysisPattern.averageWeeklyCredits}</div>
                        </div>
                    </div>
                    <div style="border: 1px solid #116CFD; background-color: #f0f7fe; display: flex;">
                        <div
                            style="width: 50%; height: 54px; color: #243656; font-family: Poppins-Regular; display: flex; justify-content: flex-start; align-items: center; padding-left: 20px;">
                            <div>Average Weekly Debits</div>
                        </div>
                        <div
                            style="width: 50%; color: #116CFD; border-left: 1px solid #116CFD; height: 54px; font-family: Poppins-SemiBold; display: flex; justify-content: flex-start; align-items: center; padding-left: 20px;">
                            <div>₦${cashFlowAnalysisPattern.averageWeeklyCredits}</div>
                        </div>
                    </div>
                    <div style="border: 1px solid #116CFD;  display: flex;">
                        <div
                            style="width: 50%; height: 54px; color: #243656; font-family: Poppins-Regular; display: flex; justify-content: flex-start; align-items: center; padding-left: 20px;">
                            <div>Average Monthly Balance</div>
                        </div>
                        <div
                            style="width: 50%; color: #116CFD; border-left: 1px solid #116CFD; height: 54px; font-family: Poppins-SemiBold; display: flex; justify-content: flex-start; align-items: center; padding-left: 20px;">
                            <div>₦${cashFlowAnalysisPattern.averageMonthlyBalance}</div>
                        </div>
                    </div>
                    <div style="border: 1px solid #116CFD; background-color: #f0f7fe; display: flex;">
                        <div
                            style="width: 50%; height: 54px; color: #243656; font-family: Poppins-Regular; display: flex; justify-content: flex-start; align-items: center; padding-left: 20px;">
                            <div>Average Weekly Balance</div>
                        </div>
                        <div
                            style="width: 50%; color: #116CFD; border-left: 1px solid #116CFD; height: 54px; font-family: Poppins-SemiBold; display: flex; justify-content: flex-start; align-items: center; padding-left: 20px;">
                            <div>₦${cashFlowAnalysisPattern.averageWeeklyBalance}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                style="height: 7px; width: 200%; margin-top: 100px; margin-bottom: 100px; background-color: rgba(217, 217, 217, 0.7); margin-left: -400px;">
            </div>


            <div style="font-size: 16px; font-family: Poppins-SemiBold;">Behavioral Analysis</div>
            <div style="font-family: Poppins-Regular; color: #8F8F8F; font-size: 15px;">Here is a report of your loan
                repayment behaviour analysed over a month period.</div>
            <div
                style="display: flex; width: 100%; justify-content: space-between; align-items: center; padding-top: 40px;">
                <div
                    style="width: 45%; padding: 20px; height: fit-content; padding-bottom: 20px; border-radius: 8px; background-color: #F6F6F6; border: 1px solid rgba(38, 119, 249, 0.4);">
                    <div style="font-size: 14px; color: #243656; font-family: Poppins-SemiBold;">Loan Amount
                        <br /><span style="color: #116CFD;">₦${behavioralAnalysisReport.totalLoanAmount}</span>
                    </div>
                    <div
                        style="font-family: Poppins-Light; src: url(./assets/Poppins-Light.ttf); color: #243656; font-size: 13px; padding-top: 10px; font-family: Poppins-Light;">
                        On October 2022</div>
                    <br /><br />
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 40px;">
                        <div style="font-family: Poppins-Regular; color: #000; font-size: 14px;">Loan To Inflow Rate
                        </div>
                        <div>${behavioralAnalysisReport.loanRepaymentToInflowRate}%</div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 40px;">
                        <div style="font-family: Poppins-Regular; color: #000; font-size: 14px;">Average Monthly Loan
                            Amount
                        </div>
                        <div>₦${behavioralAnalysisReport.averageMonthlyLoanAmount}</div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 40px;">
                        <div style="font-family: Poppins-Regular; color: #000; font-size: 14px;">Number Of Loan
                            Transaction(s)
                        </div>
                        <div>${behavioralAnalysisReport.numberLoanTransactions}</div>
                    </div>
                </div>
                <div
                    style="width: 45%; padding: 20px; height: fit-content; padding-bottom: 20px; border-radius: 8px; background-color: #F6F6F6; border: 1px solid rgba(38, 119, 249, 0.4);">
                    <div style="font-size: 14px; color: #243656; font-family: Poppins-SemiBold;">Loan Repayment Amount
                        <br /><span style="color: #116CFD;">₦${behavioralAnalysisReport.totalLoanRepaymentAmount}</span>
                    </div>
                    <div
                        style="font-family: Poppins-Light; src: url(./assets/Poppins-Light.ttf); color: #243656; font-size: 13px; padding-top: 10px; font-family: Poppins-Light;">
                        On October 2022</div>
                    <br /><br />
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 40px;">
                        <div style="font-family: Poppins-Regular; color: #000; font-size: 14px;">Loan Repayment to
                            Inflow Rate
                        </div>
                        <div>${behavioralAnalysisReport.loanRepaymentToInflowRate}%</div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 40px;">
                        <div style="font-family: Poppins-Regular; color: #000; font-size: 14px;">Average Monthly Loan
                            Repayments
                        </div>
                        <div>₦${behavioralAnalysisReport.averageMonthlyLoanAmount}</div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px;">
                        <div style="font-family: Poppins-Regular; color: #000; font-size: 14px;">Number Of Repayment
                            Transaction(s)
                        </div>
                        <div>${behavioralAnalysisReport.numberLoanTransactions}</div>
                    </div>
                </div>

            </div>
            </div>

            <div style="padding-top: 60px;">
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <div style="width: 45%; ">
                        <div
                            style="display: flex; justify-content: space-between; padding-bottom: 20px; align-items: center; width: 100%;">
                            <div style="font-family: Poppins-Regular;">Account Activity</div>
                            <div style="font-family: Poppins-Regular;">${behavioralAnalysisReport.accountActivity}%</div>
                        </div>
                        <div
                            style="display: flex; justify-content: space-between;padding-bottom: 20px;  align-items: center; width: 100%;">
                            <div style="font-family: Poppins-Regular;">Gambling Rate</div>
                            <div style="font-family: Poppins-Regular;">${behavioralAnalysisReport.gamblingRate}%</div>
                        </div>
                        <div
                            style="display: flex; justify-content: space-between;padding-bottom: 20px;  align-items: center; width: 100%;">
                            <div style="font-family: Poppins-Regular;">Inflow to Outflow</div>
                            <div style="font-family: Poppins-Regular;">${behavioralAnalysisReport.overallInflowToOutflowRate}</div>
                        </div>
                        <div
                            style="display: flex; justify-content: space-between;padding-bottom: 20px;  align-items: center; width: 100%;">
                            <div style="font-family: Poppins-Regular;">Self Transfer Inflow</div>
                            <div style="font-family: Poppins-Regular;">${behavioralAnalysisReport.overallInflowToOutflowRate}</div>
                        </div>
                    </div>
                    <div style="width: 45%; ">
                        <div
                            style="display: flex; justify-content: space-between; padding-bottom: 20px; align-items: center; width: 100%;">
                            <div style="font-family: Poppins-Regular;">Account Sweep</div>
                            <div style="font-family: Poppins-Regular;">${behavioralAnalysisReport.accountSweep}</div>
                        </div>
                        <div
                            style="display: flex; justify-content: space-between;padding-bottom: 20px;  align-items: center; width: 100%;">
                            <div style="font-family: Poppins-Regular;">Inflow Irregularity</div>
                            <div style="font-family: Poppins-Regular;">${behavioralAnalysisReport.percentOfInflowIrregularity}</div>
                        </div>
                        <div
                            style="display: flex; justify-content: space-between;padding-bottom: 20px;  align-items: center; width: 100%;">
                            <div style="font-family: Poppins-Regular;">Gambling status</div>
                            <div style="font-family: Poppins-Regular;">${behavioralAnalysisReport.percentOfInflowIrregularity}</div>
                        </div>

                    </div>
                </div>
            </div>

        
    </div>

    </div>
</body>
<script src="./assets/chart.js"></script>

<script>
    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
                'Debit Transactions',
                'Credit Transactions',
            ],
            datasets: [{
                label: 'My First Dataset',
                data: [300, 50],
                backgroundColor: [
                    '#2075FD',
                    '#324B78',
                ],
                hoverOffset: 4
            }]
        },

    });
</script>

</html>
    `
    return str
}